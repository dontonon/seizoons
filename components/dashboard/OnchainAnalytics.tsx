'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatNumber, calculatePercentage } from '@/lib/utils';
import type { OnchainAnalytics } from '@/lib/types';

/**
 * OnchainAnalytics Component
 *
 * Displays detailed onchain analytics including:
 * - Holder distribution (how many NFTs each holder has)
 * - Wallet age distribution (new vs experienced wallets)
 * - Transaction activity metrics
 */
interface OnchainAnalyticsProps {
  data: OnchainAnalytics;
}

export default function OnchainAnalytics({ data }: OnchainAnalyticsProps) {
  // Prepare data for holder distribution chart (3 categories)
  const holderDistributionData = [
    { name: '1 NFT', value: data.holderDistribution.singleToken, color: '#3b82f6' },
    { name: '2-4 NFTs', value: data.holderDistribution.smallHolder, color: '#8b5cf6' },
    { name: '5+ NFTs (Whales)', value: data.holderDistribution.mediumHolder + data.holderDistribution.largeHolder, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  // Prepare data for wallet age distribution chart (5 categories)
  const walletAgeData = [
    { name: '< 6mo', value: data.walletAgeDistribution.veryNew, color: '#10b981' },
    { name: '6-12mo', value: data.walletAgeDistribution.new, color: '#3b82f6' },
    { name: '1-3yr', value: data.walletAgeDistribution.intermediate, color: '#8b5cf6' },
    { name: '3-5yr', value: data.walletAgeDistribution.experienced, color: '#ec4899' },
    { name: '5+yr (OG)', value: data.walletAgeDistribution.veteran, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Onchain Analytics
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Deep dive into wallet behavior and token holdings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Transaction Count</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.averageTransactionCount)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Active onchain users, not just NFT collectors
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Tokens</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.uniqueTokensHeld)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Different ERC20 tokens held across all wallets
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Wallet Age</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.averageWalletAge} days
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Experienced crypto users, not new accounts
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holder Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NFT Holder Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={holderDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {holderDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Distribution shows commitment levels across the community
          </p>
        </div>

        {/* Wallet Age Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Wallet Age Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walletAgeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6">
                  {walletAgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {calculatePercentage(
              data.walletAgeDistribution.experienced + data.walletAgeDistribution.veteran,
              data.totalHolders
            )}% of holders are experienced crypto users (1+ year). OGs with 5+ years represent true believers.
          </p>
        </div>
      </div>
    </div>
  );
}
