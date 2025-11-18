import { NextResponse } from 'next/server';

/**
 * API Route: Airdrop & Token Holding Behavior Analysis
 *
 * Analyzes how holders manage their tokens:
 * - Do they hold long-term or dump immediately?
 * - Token diversity (hold many tokens vs few)
 * - Participation in airdrops
 * - Trading behavior patterns
 */

// Known airdrop/incentive tokens on Base
const KNOWN_AIRDROPS = [
  { symbol: 'OP', name: 'Optimism' },
  { symbol: 'ARB', name: 'Arbitrum' },
  { symbol: 'AERO', name: 'Aerodrome' },
  { symbol: 'WELL', name: 'Moonwell' },
  { symbol: 'DEGEN', name: 'Degen' },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressesParam = searchParams.get('addresses');

    if (!addressesParam) {
      return NextResponse.json(
        { error: 'Addresses parameter required' },
        { status: 400 }
      );
    }

    const addresses = addressesParam.split(',');
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

    // Sample subset
    const sampleSize = Math.min(addresses.length, 30);
    const sampleAddresses = addresses.slice(0, sampleSize);

    let diverseHolders = 0; // Hold 5+ different tokens
    let minimalistHolders = 0; // Hold 1-2 tokens only
    let moderateHolders = 0; // Hold 3-4 tokens
    let powerHolders = 0; // Hold 10+ tokens

    const tokenDiversityData: number[] = [];
    const airdropTokenHolders = new Map<string, number>();

    for (const address of sampleAddresses) {
      try {
        // Fetch token balances
        const response = await fetch(alchemyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'alchemy_getTokenBalances',
            params: [address, 'erc20'],
            id: 1,
          }),
        });

        const data = await response.json();
        const tokenBalances = data.result?.tokenBalances || [];
        const nonZeroTokens = tokenBalances.filter((t: any) => t.tokenBalance !== '0x0');

        const tokenCount = nonZeroTokens.length;
        tokenDiversityData.push(tokenCount);

        // Categorize by diversity
        if (tokenCount >= 10) powerHolders++;
        else if (tokenCount >= 5) diverseHolders++;
        else if (tokenCount >= 3) moderateHolders++;
        else minimalistHolders++;

        // Check for known airdrop tokens (fetch metadata for each)
        for (const token of nonZeroTokens.slice(0, 20)) {
          try {
            const metaResponse = await fetch(alchemyUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'alchemy_getTokenMetadata',
                params: [token.contractAddress],
                id: 1,
              }),
            });

            const metaData = await metaResponse.json();
            const symbol = metaData.result?.symbol;

            // Check if it's a known airdrop token
            const airdrop = KNOWN_AIRDROPS.find(a => a.symbol === symbol);
            if (airdrop) {
              airdropTokenHolders.set(airdrop.symbol, (airdropTokenHolders.get(airdrop.symbol) || 0) + 1);
            }
          } catch (err) {
            // Skip metadata errors
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 250));

      } catch (error) {
        console.error(`Error analyzing tokens for ${address}:`, error);
      }
    }

    // Calculate statistics
    const avgTokensPerWallet = tokenDiversityData.length > 0
      ? (tokenDiversityData.reduce((a, b) => a + b, 0) / tokenDiversityData.length).toFixed(1)
      : 0;

    const scaleFactor = addresses.length / sampleSize;

    // Airdrop participation
    const airdropParticipation = Array.from(airdropTokenHolders.entries())
      .map(([symbol, count]) => ({
        token: symbol,
        holders: count,
        percentage: sampleSize > 0 ? ((count / sampleSize) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.holders - a.holders);

    return NextResponse.json({
      diversity: {
        minimalist: Math.round(minimalistHolders * scaleFactor),
        moderate: Math.round(moderateHolders * scaleFactor),
        diverse: Math.round(diverseHolders * scaleFactor),
        power: Math.round(powerHolders * scaleFactor),
      },
      percentages: {
        minimalist: sampleSize > 0 ? ((minimalistHolders / sampleSize) * 100).toFixed(1) : 0,
        moderate: sampleSize > 0 ? ((moderateHolders / sampleSize) * 100).toFixed(1) : 0,
        diverse: sampleSize > 0 ? ((diverseHolders / sampleSize) * 100).toFixed(1) : 0,
        power: sampleSize > 0 ? ((powerHolders / sampleSize) * 100).toFixed(1) : 0,
      },
      stats: {
        averageTokensPerWallet: avgTokensPerWallet,
        maxTokensFound: Math.max(...tokenDiversityData, 0),
        minTokensFound: Math.min(...tokenDiversityData.filter(t => t > 0), 0),
      },
      airdropParticipation,
      insights: {
        holderType: powerHolders > diverseHolders ? 'Power Traders' :
                    diverseHolders > minimalistHolders ? 'Active DeFi Users' : 'Selective Holders',
        airdropHunters: airdropParticipation.length > 0
          ? airdropParticipation.reduce((sum, a) => sum + a.holders, 0)
          : 0,
      },
      sampleSize,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing token behavior:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze token behavior',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
