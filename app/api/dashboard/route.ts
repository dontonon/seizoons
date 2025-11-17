import { NextResponse } from 'next/server';
import type { DashboardData, OnchainAnalytics } from '@/lib/types';

/**
 * API Route: Dashboard Data Aggregation
 *
 * This is the main endpoint that orchestrates fetching data from all sources
 * (Mintify, Base chain, Alchemy, Twitter) and combines them into a unified
 * dashboard response.
 *
 * This is what the frontend will call to get all dashboard data at once.
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Fetch all data in parallel for better performance
    // Using Alchemy API for holder data (provides addresses array)
    const [holdersResponse, twitterResponse] = await Promise.all([
      fetch(`${baseUrl}/api/nft/holders-alchemy`),
      fetch(`${baseUrl}/api/twitter/metrics`),
    ]);

    if (!holdersResponse.ok) {
      const errorText = await holdersResponse.text();
      throw new Error(`Failed to fetch holders: ${errorText}`);
    }

    const holdersData = await holdersResponse.json();

    // Twitter is optional - use fallback if it fails
    let twitterData;
    if (twitterResponse.ok) {
      twitterData = await twitterResponse.json();
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
      .map((h: any) => h.address || h.owner || h)
      .filter((addr: string) => addr && addr.startsWith('0x'))
      .slice(0, 100); // Limit to 100 for performance

    // Fetch wallet analytics, token balances, and advanced analytics
    // Only if we have addresses to analyze
    let walletAnalyticsResponse, tokenBalancesResponse, advancedAnalyticsResponse;

    if (holderAddresses.length > 0) {
      const addressesParam = holderAddresses.join(',');
      const holdersJsonParam = encodeURIComponent(JSON.stringify(holdersData.holders || []));
      [walletAnalyticsResponse, tokenBalancesResponse, advancedAnalyticsResponse] = await Promise.all([
        fetch(`${baseUrl}/api/onchain/wallet-analytics?addresses=${addressesParam}`),
        fetch(`${baseUrl}/api/onchain/token-balances?addresses=${addressesParam}`),
        fetch(`${baseUrl}/api/onchain/advanced-analytics?addresses=${addressesParam}&holders=${holdersJsonParam}`),
      ]);
    }

    const walletAnalyticsData = (walletAnalyticsResponse && walletAnalyticsResponse.ok)
      ? await walletAnalyticsResponse.json()
      : null;
    const tokenBalancesData = (tokenBalancesResponse && tokenBalancesResponse.ok)
      ? await tokenBalancesResponse.json()
      : null;

    let advancedAnalyticsData = null;
    if (advancedAnalyticsResponse) {
      try {
        if (advancedAnalyticsResponse.ok) {
          advancedAnalyticsData = await advancedAnalyticsResponse.json();
        } else {
          console.log('⚠️ Advanced analytics failed, skipping');
        }
      } catch (err) {
        console.log('⚠️ Error parsing advanced analytics:', err);
      }
    }

    // Calculate holder distribution based on token counts
    const holderDistribution = calculateHolderDistribution(holdersData.holders || []);

    // Combine all onchain analytics
    const onchainAnalytics: OnchainAnalytics = {
      totalHolders: holdersData.totalHolders || 0,
      uniqueTokensHeld: tokenBalancesData?.uniqueTokenCount || 0,
      averageTransactionCount: walletAnalyticsData?.analytics?.averageTransactionCount || 0,
      averageWalletAge: walletAnalyticsData?.analytics?.averageWalletAge || 0,
      holderDistribution,
      walletAgeDistribution: walletAnalyticsData?.analytics?.walletAgeDistribution || {
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
      advanced: advancedAnalyticsData?.analytics || undefined,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
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

  holders.forEach(holder => {
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
  console.log('📊 Top holder example:', holders[0]);

  return distribution;
}
