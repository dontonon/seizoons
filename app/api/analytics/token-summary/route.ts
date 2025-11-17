import { NextResponse } from 'next/server';

/**
 * API Route: Token Holdings Summary
 *
 * Analyzes what ERC20 tokens holder wallets own on Base network.
 * Provides insights into community's token preferences.
 */
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

    // Sample subset for analysis (to avoid rate limits)
    const sampleSize = Math.min(addresses.length, 30);
    const sampleAddresses = addresses.slice(0, sampleSize);

    const tokenCount = new Map<string, { count: number; name: string; symbol: string }>();
    let totalTokensFound = 0;
    let walletsWithTokens = 0;

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

        if (nonZeroTokens.length > 0) {
          walletsWithTokens++;
          totalTokensFound += nonZeroTokens.length;

          // Get metadata for each token
          for (const token of nonZeroTokens.slice(0, 5)) {
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
            const metadata = metaData.result || {};
            const tokenKey = token.contractAddress.toLowerCase();

            if (tokenCount.has(tokenKey)) {
              tokenCount.get(tokenKey)!.count++;
            } else {
              tokenCount.set(tokenKey, {
                count: 1,
                name: metadata.name || 'Unknown',
                symbol: metadata.symbol || 'UNKNOWN',
              });
            }
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error analyzing tokens for ${address}:`, error);
      }
    }

    // Sort by popularity
    const topTokens = Array.from(tokenCount.entries())
      .map(([address, data]) => ({
        address,
        ...data,
        percentage: sampleSize > 0 ? ((data.count / sampleSize) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      topTokens,
      stats: {
        walletsAnalyzed: sampleSize,
        walletsWithTokens,
        totalUniqueTokens: tokenCount.size,
        averageTokensPerWallet: walletsWithTokens > 0
          ? (totalTokensFound / walletsWithTokens).toFixed(1)
          : 0,
        percentageWithTokens: sampleSize > 0
          ? ((walletsWithTokens / sampleSize) * 100).toFixed(1)
          : 0,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing token holdings:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze token holdings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
