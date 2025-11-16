'use client';

import { useEffect, useState } from 'react';
import type { DashboardData } from '@/lib/types';
import HeroStats from '@/components/dashboard/HeroStats';
import OnchainAnalytics from '@/components/dashboard/OnchainAnalytics';
import TwitterMetrics from '@/components/dashboard/TwitterMetrics';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import ErrorMessage from '@/components/dashboard/ErrorMessage';

/**
 * Main Dashboard Page
 *
 * This is the home page of the Snoozies NFT Dashboard.
 * It fetches and displays all analytics data from the API.
 */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try real API first, fall back to demo if it fails
      let response = await fetch('/api/dashboard');

      if (!response.ok) {
        console.warn('Real API failed, using demo data');
        response = await fetch('/api/dashboard-demo');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <ErrorMessage message={error || 'No data available'} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Snoozies NFT Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Community Analytics & Partnership Value
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats Section */}
        <HeroStats data={data} />

        {/* Onchain Analytics Section */}
        <OnchainAnalytics data={data.onchain} />

        {/* Twitter Community Metrics Section */}
        <TwitterMetrics data={data.twitter} />

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js • Data from Mintify, Base Chain & Twitter
          </p>
        </div>
      </footer>
    </div>
  );
}
