import { NextResponse } from 'next/server';
import { TWITTER_LISTS } from '@/lib/constants';
import { sleep } from '@/lib/utils';
import type { TwitterProfile, TwitterMetrics } from '@/lib/types';

/**
 * API Route: Fetch Twitter Community Metrics
 *
 * This endpoint aggregates Twitter stats from all members in the Snoozies
 * community lists to demonstrate social reach and engagement.
 *
 * Uses Twitter API v2 to fetch:
 * - List members
 * - User profiles with follower counts
 * - Engagement metrics
 */
export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
      console.log('⚠️ Twitter API not configured - returning demo data');
      // Return demo data so dashboard can still render
      return NextResponse.json({
        metrics: {
          totalMembers: 145,
          combinedFollowers: 2850000,
          averageFollowersPerMember: 19655,
          verifiedAccountsCount: 12,
          topInfluencers: [],
        },
        timestamp: new Date().toISOString(),
        demo: true,
      });
    }

    // Fetch members from both Twitter lists
    const allMembers: TwitterProfile[] = [];

    for (const listId of TWITTER_LISTS) {
      const members = await fetchListMembers(listId, bearerToken);
      allMembers.push(...members);

      // Rate limiting between list fetches
      if (TWITTER_LISTS.indexOf(listId) < TWITTER_LISTS.length - 1) {
        await sleep(1000);
      }
    }

    // Remove duplicates (same user might be in both lists)
    const uniqueMembers = Array.from(
      new Map(allMembers.map(m => [m.id, m])).values()
    );

    // Aggregate metrics
    const metrics = aggregateTwitterMetrics(uniqueMembers);

    return NextResponse.json({
      metrics,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching Twitter metrics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Twitter metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch all members from a Twitter list
 */
async function fetchListMembers(
  listId: string,
  bearerToken: string
): Promise<TwitterProfile[]> {
  try {
    const members: TwitterProfile[] = [];
    let paginationToken: string | null = null;

    // Twitter API v2 endpoint for list members
    do {
      const url = new URL(`https://api.twitter.com/2/lists/${listId}/members`);
      url.searchParams.append('max_results', '100');
      url.searchParams.append('user.fields', 'public_metrics,verified,created_at');

      if (paginationToken) {
        url.searchParams.append('pagination_token', paginationToken);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Parse user data
      if (data.data && data.data.length > 0) {
        data.data.forEach((user: any) => {
          members.push({
            id: user.id,
            username: user.username,
            name: user.name,
            followersCount: user.public_metrics?.followers_count || 0,
            followingCount: user.public_metrics?.following_count || 0,
            tweetCount: user.public_metrics?.tweet_count || 0,
            verified: user.verified || false,
          });
        });
      }

      // Check for next page
      paginationToken = data.meta?.next_token || null;

      // Rate limiting between pages
      if (paginationToken) {
        await sleep(1000);
      }

    } while (paginationToken);

    return members;

  } catch (error) {
    console.error(`Error fetching list ${listId}:`, error);
    return [];
  }
}

/**
 * Aggregate Twitter metrics from all community members
 */
function aggregateTwitterMetrics(members: TwitterProfile[]): TwitterMetrics {
  if (members.length === 0) {
    return {
      totalMembers: 0,
      combinedFollowers: 0,
      averageFollowersPerMember: 0,
      verifiedAccountsCount: 0,
      topInfluencers: [],
    };
  }

  // Calculate totals
  const combinedFollowers = members.reduce(
    (sum, member) => sum + member.followersCount,
    0
  );

  const verifiedCount = members.filter(m => m.verified).length;

  // Get top 10 influencers by follower count
  const topInfluencers = [...members]
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 10);

  return {
    totalMembers: members.length,
    combinedFollowers,
    averageFollowersPerMember: Math.round(combinedFollowers / members.length),
    verifiedAccountsCount: verifiedCount,
    topInfluencers,
  };
}
