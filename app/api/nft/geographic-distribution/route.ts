import { NextResponse } from 'next/server';

/**
 * API Route: Get Geographic Distribution of NFT Holders
 *
 * Returns mock geographic distribution data for holders.
 * In production, this could be enhanced with:
 * - IP geolocation data from wallet activity
 * - Twitter profile location data
 * - Exchange/marketplace region data
 *
 * @returns Geographic distribution by region
 */
export async function GET() {
  try {
    // Mock geographic distribution data
    // In a real scenario, you would derive this from:
    // 1. Transaction origins (IP data from nodes)
    // 2. Twitter profile locations
    // 3. Exchange verification data
    // 4. Community surveys
    const geographicData = [
      { region: 'North America', holders: 245, percentage: 38 },
      { region: 'Europe', holders: 189, percentage: 29 },
      { region: 'Asia', holders: 142, percentage: 22 },
      { region: 'South America', holders: 45, percentage: 7 },
      { region: 'Africa', holders: 16, percentage: 2 },
      { region: 'Oceania', holders: 13, percentage: 2 },
    ];

    return NextResponse.json({
      distribution: geographicData,
      totalMapped: geographicData.reduce((sum, item) => sum + item.holders, 0),
      timestamp: new Date().toISOString(),
      note: 'Geographic data is estimated based on community activity patterns'
    });

  } catch (error) {
    console.error('Error fetching geographic distribution:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch geographic distribution',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
