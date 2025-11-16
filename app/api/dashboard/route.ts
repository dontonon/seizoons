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
export async function GET(request: Request) {
  try {
    // Auto-detect base URL from request headers (works in Vercel)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Fetch all data in parallel for better performance
    const [holdersResponse, twitterResponse] = await Promise.all([
      fetch(`${baseUrl}/api/mintify/holders`),
      fetch(`${baseUrl}/api/twitter/metrics`),
    ]);

    if (!holdersResponse.ok || !twitterResponse.ok) {
      throw new Error('Failed to fetch data from one or more sources');
    }

    const holdersData = await holdersResponse.json();
    const twitterData = await twitterResponse.json();

    // Get list of holder addresses for wallet analysis
    const holderAddresses = (holdersData.holders || [])
      .map((h: any) => h.address || h.owner || h)
      .filter((addr: string) => addr && addr.startsWith('0x'))
      .slice(0, 100); // Limit to 100 for performance

    // Fetch wallet analytics and token balances
    const addressesParam = holderAddresses.join(',');
    const [walletAnalyticsResponse, tokenBalancesResponse] = await Promise.all([
      fetch(`${baseUrl}/api/onchain/wallet-analytics?addresses=${addressesParam}`),
      fetch(`${baseUrl}/api/onchain/token-balances?addresses=${addressesParam}`),
    ]);

    const walletAnalyticsData = walletAnalyticsResponse.ok
      ? await walletAnalyticsResponse.json()
      : null;
    const tokenBalancesData = tokenBalancesResponse.ok
      ? await tokenBalancesResponse.json()
      : null;

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
 */
function calculateHolderDistribution(holders: any[]) {
  const distribution = {
    singleToken: 0,
    smallHolder: 0,
    mediumHolder: 0,
    largeHolder: 0,
  };

  holders.forEach(holder => {
    const count = holder.tokenCount || holder.balance || 1;

    if (count === 1) {
      distribution.singleToken++;
    } else if (count <= 5) {
      distribution.smallHolder++;
    } else if (count <= 10) {
      distribution.mediumHolder++;
    } else {
      distribution.largeHolder++;
    }
  });

  return distribution;
}
