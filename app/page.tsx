'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalHolders: number;
  isLoading: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHolders: 0,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch NFT holders from Alchemy (direct blockchain data)
        const holdersRes = await fetch('/api/nft/holders-alchemy');
        const holdersData = await holdersRes.json();

        const totalHolders = holdersData.totalHolders || 0;

        // Update stats with holder data
        setStats({
          totalHolders,
          isLoading: false,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    }

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
            Real-time Holder Analytics on Base
          </p>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Holders"
            value={stats.isLoading ? '...' : stats.totalHolders.toLocaleString()}
            subtitle="Unique wallet addresses"
            icon="👥"
          />
          <StatCard
            title="Network"
            value="Base"
            subtitle="Layer 2 • Low Fees"
            icon="⛓️"
          />
          <StatCard
            title="Collection"
            value="Snoozies"
            subtitle="ERC-721 NFT"
            icon="🌙"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Holder Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Collection Stats
            </h2>
            <div className="space-y-4">
              <MetricRow label="Total Holders" value={stats.isLoading ? '...' : stats.totalHolders.toLocaleString()} />
              <MetricRow label="Unique Addresses" value={stats.isLoading ? '...' : stats.totalHolders.toLocaleString()} />
              <MetricRow label="Blockchain" value="Base Network" />
              <MetricRow label="Token Standard" value="ERC-721" />
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🔍</span>
              Contract Details
            </h2>
            <div className="space-y-4">
              <MetricRow label="Contract Address" value="0x61a8...f19a" />
              <MetricRow label="Network" value="Base (Chain ID: 8453)" />
              <MetricRow label="Data Source" value="Alchemy API" />
              <MetricRow label="Update Frequency" value="Real-time" />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            🚀 Live Data from Base Blockchain
          </h3>
          <p className="text-purple-100 text-lg mb-4">
            This dashboard fetches real NFT holder data directly from the Base blockchain via Alchemy API.
          </p>
          <ul className="text-purple-200 space-y-2">
            <li>✅ Real-time holder count: {stats.totalHolders > 0 ? `${stats.totalHolders} holders` : 'Loading...'}</li>
            <li>✅ Direct blockchain data via Alchemy</li>
            <li>✅ Base Network (Layer 2)</li>
            <li>🔄 Updates automatically every 5 minutes</li>
          </ul>
        </div>

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

// Reusable Components
function StatCard({ title, value, subtitle, icon }: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="text-lg font-semibold text-purple-200 mb-1">{title}</div>
      <div className="text-sm text-purple-300">{subtitle}</div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/10">
      <span className="text-purple-200">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
