import { NextResponse } from 'next/server';
import type { DashboardData, OnchainAnalytics } from '@/lib/types';

/**
 * API Route: Dashboard Data Aggregation
 *
 * This is the main endpoint that orchestrates fetching data from all sources
 * (Alchemy, Twitter) and combines them into a unified dashboard response.
 */
export async function GET() {
  try {
    console.log('🔍 Dashboard API starting...');

    // Import and call other API handlers directly (no HTTP needed)
    const holdersModule = await import('../nft/holders-alchemy/route');
    const twitterModule = await import('../twitter/metrics/route');

    // Call the handlers directly
    const [holdersResponse, twitterResponse] = await Promise.all([
      holdersModule.GET(),
      twitterModule.GET(),
    ]);

    console.log('📊 Holders response status:', holdersResponse.status);
    console.log('🐦 Twitter response status:', twitterResponse.status);

    if (!holdersResponse.ok) {
      const errorData = await holdersResponse.json();
      console.error('❌ Holders API failed:', errorData);
      throw new Error(`Failed to fetch holders: ${JSON.stringify(errorData)}`);
    }

    const holdersData = await holdersResponse.json();
    console.log('✅ Holders data:', { totalHolders: holdersData.totalHolders, holdersCount: holdersData.holders?.length });

    // Twitter is optional - use fallback if it fails
    let twitterData;
    if (twitterResponse.ok) {
      twitterData = await twitterResponse.json();
      console.log('✅ Twitter data:', { totalMembers: twitterData.metrics?.totalMembers });
    } else {
      console.log('⚠️ Twitter API failed, using fallback');
      twitterData = {
        metrics: {
          totalMembers: 0,
          combinedFollowers: 0,
          averageFollowersPerMember: 0,
          verifiedAccountsCount: 0,
          topInfluencers: []
        }
      };
    }

    // Get list of holder addresses for wallet analysis
    const holderAddresses = (holdersData.holders || [])
      .map((h: any) => {
        // Holders can be just strings (addresses) or objects
        if (typeof h === 'string') return h;
        return h.address || h.owner || h;
      })
      .filter((addr: string) => addr && typeof addr === 'string' && addr.startsWith('0x'))
      .slice(0, 100); // Limit to 100 for performance

    console.log('📍 Found addresses:', holderAddresses.length);

    // For now, skip the complex analytics that require Basescan API
    // Just show basic holder data
    const holderDistribution = calculateHolderDistribution(holdersData.holders || []);

    // Combine all onchain analytics with basic data
    const onchainAnalytics: OnchainAnalytics = {
      totalHolders: holdersData.totalHolders || 0,
      uniqueTokensHeld: 0, // Will show 0 if no token balance API
      averageTransactionCount: 0, // Will show 0 if no wallet analytics
      averageWalletAge: 0, // Will show 0 if no wallet analytics
      holderDistribution,
      walletAgeDistribution: {
        new: 0,
        intermediate: 0,
        experienced: 0,
        veteran: 0,
      },
    };

    // Combine all data
    const dashboardData: DashboardData = {
      onchain: onchainAnalytics,
      twitter: twitterData.metrics,
      advanced: undefined, // Advanced analytics disabled for now
      lastUpdated: new Date().toISOString(),
    };

    console.log('✅ Dashboard API complete');
    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate holder distribution based on NFT token counts
 * Categories: 1 NFT, 2-4 NFTs, 5+ NFTs (Whales)
 */
function calculateHolderDistribution(holders: any[]) {
  const distribution = {
    singleToken: 0,
    smallHolder: 0,
    mediumHolder: 0,
    largeHolder: 0,
  };

  console.log('📊 Calculating holder distribution for', holders.length, 'holders');

  // All demo holders have 1 NFT each (they're just addresses)
  holders.forEach(holder => {
    // If holder is just a string address, assume 1 NFT
    if (typeof holder === 'string') {
      distribution.singleToken++;
      return;
    }

    // Try multiple fields for token count
    const count = holder.tokenCount || holder.balance || holder.tokenBalance || 1;

    if (count === 1) {
      distribution.singleToken++;
    } else if (count >= 2 && count <= 4) {
      distribution.smallHolder++;
    } else if (count >= 5) {
      // 5+ NFTs = whale
      distribution.mediumHolder++;
    }
  });

  console.log('📊 Distribution results:', distribution);

  return distribution;
}
