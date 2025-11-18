import { NextResponse } from 'next/server';
import { chunkArray, sleep } from '@/lib/utils';
import type { TokenHolding } from '@/lib/types';

/**
 * API Route: Analyze ERC20 Token Holdings
 *
 * This endpoint analyzes what ERC20 tokens the NFT holders own,
 * which demonstrates they are real DeFi users, not just NFT collectors.
 *
 * Uses Alchemy API to fetch token balances for wallets.
 *
 * @param searchParams - addresses: comma-separated list of wallet addresses
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressesParam = searchParams.get('addresses');

    if (!addressesParam) {
      return NextResponse.json(
        { error: 'Addresses parameter is required' },
        { status: 400 }
      );
    }

    const addresses = addressesParam.split(',').slice(0, 50); // Limit to 50 for free tier
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    // Alchemy Base URL
    const alchemyBaseUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

    // Fetch token balances in chunks
    const chunks = chunkArray(addresses, 10);
    const tokenFrequency = new Map<string, { token: TokenHolding; holderCount: number }>();
    let totalTokensAcrossWallets = 0;

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(address =>
        fetchTokenBalances(address, alchemyBaseUrl)
      );
      const chunkResults = await Promise.all(chunkPromises);

      chunkResults.forEach(tokens => {
        totalTokensAcrossWallets += tokens.length;
        tokens.forEach(token => {
          // Track token frequency (how many wallets hold each token)
          const key = token.tokenAddress.toLowerCase();
          if (!tokenFrequency.has(key)) {
            tokenFrequency.set(key, { token, holderCount: 1 });
          } else {
            const existing = tokenFrequency.get(key)!;
            existing.holderCount++;
          }
        });
      });

      // Rate limiting
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await sleep(500);
      }
    }

    // Get top tokens sorted by holder count
    const topTokens = Array.from(tokenFrequency.values())
      .sort((a, b) => b.holderCount - a.holderCount)
      .slice(0, 20)
      .map(({ token, holderCount }) => ({
        ...token,
        holderCount,
        holderPercentage: Math.round((holderCount / addresses.length) * 100),
      }));

    const uniqueTokens = Array.from(tokenFrequency.values()).map(t => t.token);

    return NextResponse.json({
      uniqueTokenCount: uniqueTokens.length,
      topTokens, // Top 20 tokens with holder counts
      walletsAnalyzed: addresses.length,
      totalTokensAcrossWallets,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing token balances:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze token balances',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch ERC20 token balances for a single wallet using Alchemy
 */
async function fetchTokenBalances(
  address: string,
  alchemyUrl: string
): Promise<TokenHolding[]> {
  try {
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

    if (data.error) {
      console.error(`Alchemy API error for ${address}:`, data.error);
      return [];
    }

    // Filter out tokens with zero balance and get metadata
    const tokenBalances = data.result?.tokenBalances || [];
    const nonZeroTokens = tokenBalances.filter(
      (token: any) => token.tokenBalance !== '0x0'
    );

    // Fetch metadata for each token (in a real implementation, you might want to batch this)
    const tokensWithMetadata = await Promise.all(
      nonZeroTokens.slice(0, 10).map(async (token: any) => {
        try {
          const metadataResponse = await fetch(alchemyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'alchemy_getTokenMetadata',
              params: [token.contractAddress],
              id: 1,
            }),
          });

          const metadataData = await metadataResponse.json();
          const metadata = metadataData.result || {};

          return {
            tokenAddress: token.contractAddress,
            tokenName: metadata.name || 'Unknown',
            tokenSymbol: metadata.symbol || 'UNKNOWN',
            balance: token.tokenBalance,
            decimals: metadata.decimals || 18,
          };
        } catch (error) {
          return null;
        }
      })
    );

    return tokensWithMetadata.filter(t => t !== null) as TokenHolding[];

  } catch (error) {
    console.error(`Error fetching token balances for ${address}:`, error);
    return [];
  }
}
