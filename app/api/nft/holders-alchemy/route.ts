import { NextResponse } from 'next/server';
import { NFT_CONTRACT } from '@/lib/constants';

/**
 * API Route: Fetch NFT Holders using Alchemy
 *
 * This endpoint uses Alchemy's NFT API to get holder information
 * directly from the blockchain. This works without needing Mintify API.
 *
 * @returns Holder count and addresses
 */
export async function GET() {
  try {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      console.log('⚠️ Alchemy API key not configured - returning demo data');
      // Return demo data so dashboard can still render
      return NextResponse.json({
        totalHolders: 919,
        holders: generateDemoHolders(919),
        pageKey: null,
        timestamp: new Date().toISOString(),
        demo: true,
      });
    }

    // Alchemy Base URL for Base network
    const alchemyBaseUrl = `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`;

    // Fetch owners for the contract using Alchemy's NFT API
    const response = await fetch(
      `${alchemyBaseUrl}/getOwnersForContract?contractAddress=${NFT_CONTRACT}&withTokenBalances=false`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Alchemy API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Extract holder information
    // Alchemy returns { owners: ['0x...', '0x...'], pageKey?: string }
    const owners = data.owners || [];
    const totalHolders = owners.length;

    return NextResponse.json({
      totalHolders,
      holders: owners,
      pageKey: data.pageKey || null, // For pagination if needed
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching NFT holders from Alchemy:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch NFT holders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Generate demo holder addresses for development/demo purposes
 */
function generateDemoHolders(count: number): string[] {
  const holders: string[] = [];

  // Generate realistic-looking Ethereum addresses
  for (let i = 0; i < count; i++) {
    const randomHex = Math.random().toString(16).substring(2, 42).padEnd(40, '0');
    holders.push(`0x${randomHex}`);
  }

  return holders;
}
