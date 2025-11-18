'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { WalletBehaviorPattern } from '@/lib/types';

/**
 * WalletBehaviorCategories Component
 *
 * Displays wallet behavior categorization:
 * - HODLers, Traders, DeFi Users, Whales, NFT Collectors, Bots
 * - Distribution pie chart
 * - Average metrics per category
 * - Insights into community composition
 */
interface WalletBehaviorCategoriesProps {
  patterns: WalletBehaviorPattern[];
}

export default function WalletBehaviorCategories({ patterns }: WalletBehaviorCategoriesProps) {
  // Prepare data for pie chart
  const pieData = patterns.map(p => ({
    name: p.category,
    value: p.percentage,
    count: p.count,
  }));

  // Prepare data for metrics bar chart
  const metricsData = patterns.map(p => ({
    name: p.category,
    transactions: p.avgTransactions,
    gas: parseFloat((p.avgGasSpent * 1000).toFixed(2)), // Convert to milli-ETH for better scale
  }));

  // Get category-specific colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'HODLer': '#10b981', // Green
      'DeFi User': '#8b5cf6', // Purple
      'Trader': '#f59e0b', // Orange
      'Whale': '#ec4899', // Pink
      'NFT Collector': '#3b82f6', // Blue
      'Bot': '#ef4444', // Red
    };
    return colors[category] || '#6b7280';
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'HODLer': '💎',
      'DeFi User': '🌊',
      'Trader': '📈',
      'Whale': '🐋',
      'NFT Collector': '🖼️',
      'Bot': '🤖',
    };
    return emojis[category] || '👤';
  };

  // Get category description
  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      'HODLer': 'Long-term believers with minimal trading activity',
      'DeFi User': 'Active in DeFi protocols like Uniswap, Aave, etc.',
      'Trader': 'High transaction count, actively trading tokens',
      'Whale': 'Large NFT holdings, significant portfolio value',
      'NFT Collector': 'Focused on collecting NFTs across projects',
      'Bot': 'Automated trading patterns, very high tx count',
    };
    return descriptions[category] || 'General wallet activity';
  };

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Wallet Behavior Categories
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Understanding who your holders are based on onchain behavior
        </p>
      </div>

      {/* Stats Cards - Top 3 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {patterns.slice(0, 3).map((pattern, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 rounded-lg p-3"
                style={{ backgroundColor: `${getCategoryColor(pattern.category)}20` }}
              >
                <span className="text-3xl">{getCategoryEmoji(pattern.category)}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  #{index + 1} Category
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {pattern.category}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Count:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {pattern.count} ({pattern.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Community Composition
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Count: <span className="font-medium">{payload[0].payload.count}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {payload[0].payload.value}% of holders
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Breakdown of holder types based on transaction patterns and activity
          </p>
        </div>

        {/* Average Transactions Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Average Transactions by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Avg Txs: <span className="font-medium">{payload[0].value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="transactions" radius={[0, 4, 4, 0]}>
                  {metricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Transaction count varies widely - Bots and Traders are most active
          </p>
        </div>
      </div>

      {/* Category Details Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg p-6 border-2 transition-all hover:shadow-lg"
              style={{ borderColor: getCategoryColor(pattern.category) }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getCategoryEmoji(pattern.category)}</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {pattern.category}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {pattern.count} holders ({pattern.percentage}%)
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {getCategoryDescription(pattern.category)}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Transactions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {pattern.avgTransactions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Gas Spent</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {pattern.avgGasSpent.toFixed(4)} ETH
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pattern.percentage}%`,
                    backgroundColor: getCategoryColor(pattern.category),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>💡 Key Insight:</strong> Your community is primarily composed of <strong>{patterns[0]?.category}s</strong> ({patterns[0]?.percentage}%),
            showing a {patterns[0]?.category === 'HODLer' ? 'strong long-term commitment' :
            patterns[0]?.category === 'DeFi User' ? 'highly engaged DeFi-savvy audience' :
            patterns[0]?.category === 'Trader' ? 'active trading community' : 'diverse engaged community'}.
            {patterns[1] && ` ${patterns[1].category}s make up ${patterns[1].percentage}% as the second largest group.`}
          </p>
        </div>
      </div>
    </div>
  );
}
