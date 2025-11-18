'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { formatNumber } from '@/lib/utils';
import type { AdvancedAnalytics } from '@/lib/types';

/**
 * AdvancedAnalytics Component
 *
 * Displays advanced wallet analytics including:
 * - DeFi protocol usage
 * - Airdrop holding patterns
 * - Transaction timing analysis
 * - Wallet behavior categorization
 */
interface AdvancedAnalyticsProps {
  data: AdvancedAnalytics;
}

export default function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
  // Prepare data for DeFi protocols chart
  const defiChartData = data.defiProtocols.slice(0, 8).map(protocol => ({
    name: protocol.protocolName.replace(' Router', '').replace(' Pool', ''),
    users: protocol.userCount,
    percentage: protocol.percentage,
  }));

  // Prepare data for wallet behavior chart
  const behaviorChartData = data.behaviorPatterns.map(pattern => ({
    name: pattern.category,
    count: pattern.count,
    percentage: pattern.percentage,
    avgTxs: pattern.avgTransactions,
  }));

  // Prepare data for hourly activity chart
  const hourlyData = data.timing.hourDistribution.map((count, hour) => ({
    hour: `${hour}:00`,
    transactions: count,
  }));

  // Prepare data for daily activity chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = data.timing.dayDistribution.map((count, day) => ({
    day: daysOfWeek[day],
    transactions: count,
  }));

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Advanced Wallet Intelligence
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Deep insights into DeFi usage, airdrops, timing patterns, and wallet behaviors
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">DeFi Adoption</p>
              <p className="text-3xl font-bold mt-1">{data.defiAdoption}%</p>
            </div>
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs mt-2 opacity-80">
            Using DeFi protocols
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Airdrop Hunters</p>
              <p className="text-3xl font-bold mt-1">{data.airdropHunters}%</p>
            </div>
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <p className="text-xs mt-2 opacity-80">
            Hold 3+ airdropped tokens
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Peak Activity</p>
              <p className="text-3xl font-bold mt-1">{data.timing.peakHour}:00</p>
            </div>
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs mt-2 opacity-80">
            UTC time zone
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Most Active</p>
              <p className="text-3xl font-bold mt-1">{data.timing.peakDay}</p>
            </div>
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs mt-2 opacity-80">
            Peak transaction day
          </p>
        </div>
      </div>

      {/* Charts Row 1: DeFi & Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* DeFi Protocol Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            DeFi Protocol Usage
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defiChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
                          <p className="text-sm text-blue-600">{payload[0].value} users ({payload[0].payload.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="users" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Top DeFi protocols used by your holders
          </p>
        </div>

        {/* Wallet Behavior Patterns */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Wallet Behavior Categories
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
                          <p className="text-sm text-purple-600">{payload[0].value} wallets ({payload[0].payload.percentage}%)</p>
                          <p className="text-xs text-gray-500">Avg Txs: {payload[0].payload.avgTxs}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Categorization based on onchain activity patterns
          </p>
        </div>
      </div>

      {/* Charts Row 2: Timing Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Hourly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hourly Transaction Activity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" angle={-45} textAnchor="end" height={80} interval={2} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Peak activity at {data.timing.peakHour}:00 UTC
          </p>
        </div>

        {/* Daily Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Transaction Activity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="transactions" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Most active on {data.timing.peakDay}
          </p>
        </div>
      </div>

      {/* Airdrop Holdings */}
      {data.airdrops.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Airdrop Token Holdings
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.airdrops.map((airdrop, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {airdrop.tokenSymbol}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {airdrop.tokenName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {airdrop.holderCount} holders
                </div>
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400 mt-1">
                  {airdrop.percentage}%
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {data.airdropHunters}% of holders are airdrop hunters (3+ tokens)
          </p>
        </div>
      )}
    </div>
  );
}
