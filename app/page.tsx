'use client';

import { useEffect, useState } from 'react';
import OnchainAnalytics from '@/components/dashboard/OnchainAnalytics';
import AdvancedAnalytics from '@/components/dashboard/AdvancedAnalytics';
import TwitterMetrics from '@/components/dashboard/TwitterMetrics';
import HeroStats from '@/components/dashboard/HeroStats';
import PopularTokens from '@/components/dashboard/PopularTokens';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import ErrorMessage from '@/components/dashboard/ErrorMessage';
import type { DashboardData } from '@/lib/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const data = await response.json();
      setDashboardData(data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌙 Snoozies NFT Dashboard
          </h1>
          <p className="text-xl text-purple-200">
            Advanced Community Analytics & Wallet Intelligence
          </p>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorMessage message={error} onRetry={fetchDashboardData} />
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && dashboardData && (
          <div className="space-y-8">
            {/* Hero Stats */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <HeroStats data={dashboardData.onchain} />
            </div>

            {/* Twitter Metrics */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <TwitterMetrics data={dashboardData.twitter} />
            </div>

            {/* Onchain Analytics */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <OnchainAnalytics data={dashboardData.onchain} />
            </div>

            {/* Popular Tokens */}
            {dashboardData.topTokens && dashboardData.topTokens.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <PopularTokens tokens={dashboardData.topTokens} />
              </div>
            )}

            {/* Advanced Analytics */}
            {dashboardData.advanced && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <AdvancedAnalytics data={dashboardData.advanced} />
              </div>
            )}

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">
                🚀 Advanced Analytics Powered By
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-100">
                <div>
                  <h4 className="font-semibold text-white mb-2">Blockchain Data</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✅ Alchemy NFT API - Real holder data</li>
                    <li>✅ Basescan API - Transaction history</li>
                    <li>✅ Base RPC - Token balances</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Analytics Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✅ DeFi Protocol Usage</li>
                    <li>✅ Airdrop Holdings Patterns</li>
                    <li>✅ Transaction Timing Analysis</li>
                    <li>✅ Wallet Behavior Categories</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-purple-200">
                <p className="text-sm">
                  Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pb-8">
          <p className="text-purple-300">
            Built with ❤️ for the Snoozies Community
          </p>
        </footer>
      </div>
    </div>
  );
}
