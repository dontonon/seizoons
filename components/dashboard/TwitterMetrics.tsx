'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber, formatLargeNumber } from '@/lib/utils';
import type { TwitterMetrics } from '@/lib/types';

/**
 * TwitterMetrics Component
 *
 * Displays Twitter/X community metrics including:
 * - Total community members
 * - Combined follower reach
 * - Top influencers
 * - Verified accounts
 */
interface TwitterMetricsProps {
  data: TwitterMetrics;
}

export default function TwitterMetrics({ data }: TwitterMetricsProps) {
  // Prepare data for top influencers chart
  const influencerData = data.topInfluencers.map(user => ({
    name: user.username.length > 12 ? user.username.substring(0, 12) + '...' : user.username,
    followers: user.followersCount,
    verified: user.verified,
  }));

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Twitter Community Metrics
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Social reach and engagement across the community
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-sky-100 dark:bg-sky-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-sky-600 dark:text-sky-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Community Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.totalMembers)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Active Twitter accounts in the community
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Combined Reach</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatLargeNumber(data.combinedFollowers)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Total followers across all community members
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified Accounts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.verifiedAccountsCount)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Verified Twitter accounts in the community
          </p>
        </div>
      </div>

      {/* Top Influencers Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Community Influencers
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={influencerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(value: number) => formatNumber(value)}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="followers" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Average {formatLargeNumber(data.averageFollowersPerMember)} followers per member
          • Top 10 influencers shown
        </p>
      </div>

      {/* Value Proposition */}
      <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Marketing Partnership Value</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Social Amplification</h4>
            <p className="text-indigo-100">
              With {formatLargeNumber(data.combinedFollowers)} combined followers, partnerships
              with Snoozies holders guarantee significant social media visibility and organic reach.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quality Audience</h4>
            <p className="text-indigo-100">
              {data.verifiedAccountsCount} verified accounts demonstrate authenticity. These are
              real people with real influence, not bot accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
