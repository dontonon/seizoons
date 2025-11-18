'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { AirdropHolding } from '@/lib/types';

/**
 * AirdropHoldingPatterns Component
 *
 * Displays which popular Base tokens the community holds:
 * - DEGEN, BRETT, TOSHI holdings
 * - % of holders collecting each token
 * - Airdrop hunter identification (3+ tokens)
 * - Visual overlap patterns
 */
interface AirdropHoldingPatternsProps {
  airdrops: AirdropHolding[];
  airdropHunters: number; // % with 3+ airdrops
}

export default function AirdropHoldingPatterns({ airdrops, airdropHunters }: AirdropHoldingPatternsProps) {
  // Prepare data for chart
  const chartData = airdrops.map(a => ({
    name: a.tokenSymbol,
    holders: a.holderCount,
    percentage: a.percentage,
    fullName: a.tokenName,
  }));

  // Get token-specific colors
  const getTokenColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      'DEGEN': '#a855f7', // Purple
      'BRETT': '#3b82f6', // Blue
      'TOSHI': '#f59e0b', // Orange
    };
    return colors[symbol] || '#6366f1';
  };

  // Create pie chart data for airdrop hunters
  const hunterData = [
    { name: 'Airdrop Hunters (3+ tokens)', value: airdropHunters, color: '#ec4899' },
    { name: 'Regular Holders', value: 100 - airdropHunters, color: '#6b7280' },
  ];

  // Get token emoji
  const getTokenEmoji = (symbol: string) => {
    const emojis: { [key: string]: string } = {
      'DEGEN': '🎩',
      'BRETT': '🔵',
      'TOSHI': '🟠',
    };
    return emojis[symbol] || '🪙';
  };

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Airdrop Hunting Patterns
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Which popular Base tokens is the community collecting?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-pink-100 dark:bg-pink-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.546 2.546 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Airdrop Hunters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {airdropHunters}%
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Holders with 3+ different airdropped tokens
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tokens Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {airdrops.length}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Popular Base chain airdrops
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Token</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {airdrops[0]?.tokenSymbol || 'N/A'} {getTokenEmoji(airdrops[0]?.tokenSymbol)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {airdrops[0]?.percentage}% of holders own this
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Token Holdings Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Token Holdings Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {payload[0].payload.fullName} ({payload[0].payload.name})
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Holders: <span className="font-medium">{payload[0].payload.holders}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Adoption: <span className="font-medium">{payload[0].payload.percentage}%</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="holders" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTokenColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Number of holders collecting each popular Base token
          </p>
        </div>

        {/* Airdrop Hunters Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Airdrop Hunters vs Regular Holders
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hunterData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name.split(' ')[0]}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {hunterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {airdropHunters}% of holders are actively collecting multiple airdrops, showing strong engagement with the Base ecosystem
          </p>
        </div>
      </div>

      {/* Token Details Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Token Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {airdrops.map((token, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg p-6 border-2"
              style={{ borderColor: getTokenColor(token.tokenSymbol) }}
            >
              <div className="absolute top-0 right-0 text-6xl opacity-10">
                {getTokenEmoji(token.tokenSymbol)}
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {token.tokenSymbol}
                  </h4>
                  <span className="text-2xl">{getTokenEmoji(token.tokenSymbol)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {token.tokenName}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Holders:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {token.holderCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Adoption:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {token.percentage}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${token.percentage}%`,
                        backgroundColor: getTokenColor(token.tokenSymbol),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <strong>💡 Insight:</strong> {airdrops[0]?.tokenSymbol} has the highest adoption at {airdrops[0]?.percentage}%, showing strong community alignment with Base ecosystem tokens.
          {airdropHunters}% are multi-token collectors, indicating an active and engaged community.
        </p>
      </div>
    </div>
  );
}
