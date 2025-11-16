import { NextResponse } from 'next/server';
import { NFT_CONTRACT } from '@/lib/constants';

/**
 * API Route: Fetch NFT Holders from Mintify
 *
 * This endpoint fetches the list of wallet addresses that hold Snoozies NFTs
 * from the Mintify API.
 *
 * @returns Array of holder addresses with their token counts
 */
export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_MINTIFY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mintify API key not configured' },
        { status: 500 }
      );
    }

    // Fetch holders from Mintify API
    // According to Mintify docs: https://docs.mintify.com/other/api-data-and-analytics
    const response = await fetch(
      `https://api.mintify.com/v1/collections/${NFT_CONTRACT}/holders`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`Mintify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the data to our expected format
    // Note: Actual response format may vary - adjust based on real API response
    const holders = data.holders || data.data || [];

    return NextResponse.json({
      holders,
      totalHolders: holders.length,
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
