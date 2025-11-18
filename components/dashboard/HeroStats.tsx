import { formatNumber, calculatePercentage } from '@/lib/utils';
import type { OnchainAnalytics } from '@/lib/types';

/**
 * HeroStats Component
 *
 * Displays the key metrics in large, impressive cards at the top of the dashboard.
 * These are the "hero" numbers that immediately show the value of the community.
 */
interface HeroStatsProps {
  data: OnchainAnalytics;
}

export default function HeroStats({ data }: HeroStatsProps) {
  // Calculate whale count (5+ NFTs)
  const whaleCount = data.holderDistribution.mediumHolder + data.holderDistribution.largeHolder;

  // Calculate crypto veterans (3+ year old wallets) as percentage
  const veteranCount = data.walletAgeDistribution.experienced + data.walletAgeDistribution.veteran;
  const veteranPercentage = Math.round((veteranCount / data.totalHolders) * 100);

  const stats = [
    {
      label: 'Total Holders',
      value: formatNumber(data.totalHolders),
      description: 'Unique wallet addresses',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Whales',
      value: formatNumber(whaleCount),
      description: '5+ NFTs held',
      icon: '🐋',
      color: 'from-orange-500 to-orange-600',
    },
    {
      label: 'Token Diversity',
      value: formatNumber(data.uniqueTokensHeld),
      description: 'Unique tokens held',
      icon: '💎',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Crypto Veterans',
      value: `${veteranPercentage}%`,
      description: '3+ year old wallets',
      icon: '👑',
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Avg Wallet Age',
      value: `${Math.round(data.averageWalletAge)} days`,
      description: 'Community experience',
      icon: '🔥',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Community Strength Metrics
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real community value backed by onchain data and wallet intelligence
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
