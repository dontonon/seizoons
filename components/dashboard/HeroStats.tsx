import { formatNumber, formatLargeNumber } from '@/lib/utils';
import type { DashboardData } from '@/lib/types';

/**
 * HeroStats Component
 *
 * Displays the key metrics in large, impressive cards at the top of the dashboard.
 * These are the "hero" numbers that immediately show the value of the community.
 */
interface HeroStatsProps {
  data: DashboardData;
}

export default function HeroStats({ data }: HeroStatsProps) {
  const stats = [
    {
      label: 'Total NFT Holders',
      value: formatNumber(data.onchain.totalHolders),
      description: 'Unique wallet addresses',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Combined Social Reach',
      value: formatLargeNumber(data.twitter.combinedFollowers),
      description: `${formatNumber(data.twitter.totalMembers)} community members`,
      icon: '🐦',
      color: 'from-sky-500 to-sky-600',
    },
    {
      label: 'Unique Tokens Held',
      value: formatNumber(data.onchain.uniqueTokensHeld),
      description: 'Different ERC20 tokens',
      icon: '💎',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Average Wallet Age',
      value: `${data.onchain.averageWalletAge}`,
      description: 'Days (experienced users)',
      icon: '⏱️',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Why Partner with Snoozies?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real community value backed by onchain data and social metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
          >
            {/* Colored header */}
            <div className={`bg-gradient-to-r ${stat.color} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{stat.icon}</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.label}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
