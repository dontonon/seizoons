import { NextResponse } from 'next/server';
import { NFT_CONTRACT } from '@/lib/constants';

/**
 * API Route: Holder Distribution Analysis
 *
 * Analyzes how many NFTs each holder owns to identify:
 * - Small holders (1 NFT)
 * - Medium holders (2-5 NFTs)
 * - Whales (5+ NFTs)
 */
export async function GET() {
  try {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    // Alchemy Base URL for Base network
    const alchemyBaseUrl = `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`;

    // Fetch owners with token balances
    const response = await fetch(
      `${alchemyBaseUrl}/getOwnersForContract?contractAddress=${NFT_CONTRACT}&withTokenBalances=true`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 10 minutes
        next: { revalidate: 600 }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alchemy API error:', response.status, errorText);
      throw new Error(`Alchemy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Alchemy response sample:', JSON.stringify(data.owners?.[0], null, 2));

    const owners = data.owners || [];

    // Analyze distribution
    let small = 0;  // 1 NFT
    let medium = 0; // 2-5 NFTs
    let whales = 0; // 5+ NFTs

    const holderDetails = owners.map((owner: any) => {
      // Alchemy returns tokenBalance as the count of NFTs owned
      // Try multiple possible data structures
      let balance = 1; // default

      if (owner.tokenBalance) {
        // Sometimes it's a direct number
        balance = parseInt(owner.tokenBalance);
      } else if (owner.tokenBalances && Array.isArray(owner.tokenBalances)) {
        // Sometimes it's an array of token IDs they own
        balance = owner.tokenBalances.length;
      } else if (typeof owner === 'object' && owner.ownerAddress) {
        // Count how many times this address appears (shouldn't happen with this API)
        balance = 1;
      }

      if (balance === 1) small++;
      else if (balance <= 5) medium++;
      else whales++;

      return {
        address: owner.ownerAddress || owner.address || 'unknown',
        balance,
      };
    });

    // Sort by balance descending for leaderboard
    const topHolders = [...holderDetails]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    console.log('Distribution:', { small, medium, whales });
    console.log('Top holder:', topHolders[0]);

    return NextResponse.json({
      distribution: {
        small,
        medium,
        whales,
        total: owners.length,
      },
      percentages: {
        small: owners.length > 0 ? ((small / owners.length) * 100).toFixed(1) : 0,
        medium: owners.length > 0 ? ((medium / owners.length) * 100).toFixed(1) : 0,
        whales: owners.length > 0 ? ((whales / owners.length) * 100).toFixed(1) : 0,
      },
      topHolders,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing holder distribution:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze holder distribution',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
