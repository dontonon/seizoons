import { NextResponse } from 'next/server';
import { NFT_CONTRACT } from '@/lib/constants';

/**
 * API Route: Fetch NFT Holders from Mintify
 *
 * This endpoint fetches the list of wallet addresses that hold Snoozies NFTs
 * from the Mintify API for Base network.
 *
 * @returns Array of holder addresses with their token counts
 */
export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_MINTIFY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mintify API key not configured. Sign up at https://learn.mintify.xyz/api' },
        { status: 500 }
      );
    }

    // Fetch collection data from Mintify API (Base network)
    // Using api-base.mintify.xyz for Base chain collections
    const response = await fetch(
      `https://api-base.mintify.xyz/collections/${NFT_CONTRACT}`,
      {
        headers: {
          'API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mintify API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Extract holder data from response
    // The API returns collection info including holder count
    const holderCount = data.holders || data.holder_count || data.unique_holders || 0;

    return NextResponse.json({
      totalHolders: holderCount,
      collectionData: data,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching Mintify holders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch NFT holders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
