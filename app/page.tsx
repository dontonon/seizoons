'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  totalHolders: number;
  holderAddresses: string[];
  distribution: {
    small: number;
    medium: number;
    large: number;
    whales: number;
  };
  walletAge: {
    new: number;
    intermediate: number;
    experienced: number;
    veteran: number;
  };
  activity: {
    averageTransactions: number;
    activeWallets: number;
  };
  topHolders: Array<{ address: string; balance: number }>;
  topTokens: Array<{ symbol: string; name: string; percentage: string }>;
  isLoading: boolean;
  error: string | null;
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalHolders: 0,
    holderAddresses: [],
    distribution: { small: 0, medium: 0, large: 0, whales: 0 },
    walletAge: { new: 0, intermediate: 0, experienced: 0, veteran: 0 },
    activity: { averageTransactions: 0, activeWallets: 0 },
    topHolders: [],
    topTokens: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAllData() {
      try {
        console.log('Fetching holder data...');

        // Step 1: Fetch holder addresses first (critical)
        const holdersRes = await fetch('/api/nft/holders-alchemy');

        if (!holdersRes.ok) {
          throw new Error(`Holders API failed: ${holdersRes.status}`);
        }

        const holdersData = await holdersRes.json();
        const holders = holdersData.holders || [];
        const totalHolders = holdersData.totalHolders || 0;

        console.log(`Got ${totalHolders} holders`);

        // Update with holder count immediately
        setData(prev => ({
          ...prev,
          totalHolders,
          holderAddresses: holders,
          isLoading: false // Show dashboard with holder count at least
        }));

        // Step 2: Fetch holder distribution (nice to have)
        try {
          console.log('Fetching distribution...');
          const distRes = await fetch('/api/analytics/holder-distribution', {
            signal: AbortSignal.timeout(15000) // 15 second timeout
          });
          if (distRes.ok) {
            const distData = await distRes.json();
            setData(prev => ({
              ...prev,
              distribution: distData.distribution || prev.distribution,
              topHolders: distData.topHolders || prev.topHolders,
            }));
          }
        } catch (err) {
          console.error('Distribution API failed:', err);
        }

        // Step 3: Fetch other analytics (optional, don't block on these)
        const addresses = holders.slice(0, 50).join(',');

        if (addresses) {
          // Wallet age
          try {
            console.log('Fetching wallet age...');
            const ageRes = await fetch(`/api/analytics/wallet-age?addresses=${addresses}`, {
              signal: AbortSignal.timeout(20000) // 20 second timeout
            });
            if (ageRes.ok) {
              const ageData = await ageRes.json();
              setData(prev => ({
                ...prev,
                walletAge: ageData.distribution || prev.walletAge,
              }));
            }
          } catch (err) {
            console.error('Wallet age API failed:', err);
          }

          // Activity metrics
          try {
            console.log('Fetching activity...');
            const activityRes = await fetch(`/api/analytics/activity?addresses=${addresses}`, {
              signal: AbortSignal.timeout(20000)
            });
            if (activityRes.ok) {
              const activityData = await activityRes.json();
              setData(prev => ({
                ...prev,
                activity: activityData.activity || prev.activity,
              }));
            }
          } catch (err) {
            console.error('Activity API failed:', err);
          }

          // Token holdings
          try {
            console.log('Fetching token data...');
            const tokenRes = await fetch(`/api/analytics/token-summary?addresses=${addresses}`, {
              signal: AbortSignal.timeout(30000) // This one is slowest
            });
            if (tokenRes.ok) {
              const tokenData = await tokenRes.json();
              setData(prev => ({
                ...prev,
                topTokens: tokenData.topTokens || prev.topTokens,
              }));
            }
          } catch (err) {
            console.error('Token API failed:', err);
          }
        }

      } catch (error) {
        console.error('Critical error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load data'
        }));
      }
    }

    fetchAllData();
  }, []);

  const distributionChartData = [
    { name: '1 NFT', value: data.distribution.small, label: 'Small Holders' },
    { name: '2-5 NFTs', value: data.distribution.medium, label: 'Medium Holders' },
    { name: '6-10 NFTs', value: data.distribution.large, label: 'Large Holders' },
    { name: '11+ NFTs', value: data.distribution.whales, label: 'Whales' },
  ];

  const ageChartData = [
    { name: 'New', value: data.walletAge.new, label: '< 30 days' },
    { name: 'Intermediate', value: data.walletAge.intermediate, label: '30-180 days' },
    { name: 'Experienced', value: data.walletAge.experienced, label: '180-365 days' },
    { name: 'Veteran', value: data.walletAge.veteran, label: '1+ year' },
  ];

  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Loading analytics... 📊</div>
          <div className="text-purple-300 text-sm">This may take 10-15 seconds</div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">⚠️ Error Loading Data</div>
          <div className="text-purple-300">{data.error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasDistribution = data.distribution.small > 0 || data.distribution.whales > 0;
  const hasActivity = data.activity.averageTransactions > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌙 Snoozies Analytics Dashboard
          </h1>
          <p className="text-xl text-purple-200">
            Deep Insights Into Your {data.totalHolders} Holders on Base
          </p>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Holders"
            value={data.totalHolders.toLocaleString()}
            subtitle="Unique addresses"
            icon="👥"
          />
          <StatCard
            title="Whales"
            value={data.distribution.whales.toString()}
            subtitle="Holders with 11+ NFTs"
            icon="🐋"
          />
          <StatCard
            title="Avg Transactions"
            value={hasActivity ? data.activity.averageTransactions.toString() : 'Loading...'}
            subtitle="Per wallet"
            icon="⚡"
          />
          <StatCard
            title="Active Wallets"
            value={hasActivity && data.totalHolders > 0
              ? `${((data.activity.activeWallets / data.totalHolders) * 100).toFixed(0)}%`
              : 'Loading...'}
            subtitle="5+ transactions"
            icon="🔥"
          />
        </div>

        {/* Charts Row */}
        {hasDistribution && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Holder Distribution Pie Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Holder Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <MetricRow label="Small Holders (1 NFT)" value={data.distribution.small.toLocaleString()} />
                <MetricRow label="Medium (2-5 NFTs)" value={data.distribution.medium.toLocaleString()} />
                <MetricRow label="Large (6-10 NFTs)" value={data.distribution.large.toLocaleString()} />
                <MetricRow label="Whales (11+ NFTs)" value={data.distribution.whales.toLocaleString()} />
              </div>
            </div>

            {/* Wallet Age Bar Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">⏱️</span>
                Wallet Age Distribution
              </h2>
              {data.walletAge.new > 0 || data.walletAge.veteran > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageChartData}>
                      <XAxis dataKey="name" stroke="#a78bfa" />
                      <YAxis stroke="#a78bfa" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #8b5cf6' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    <MetricRow label="New (< 30 days)" value={data.walletAge.new.toLocaleString()} />
                    <MetricRow label="Intermediate (30-180d)" value={data.walletAge.intermediate.toLocaleString()} />
                    <MetricRow label="Experienced (180-365d)" value={data.walletAge.experienced.toLocaleString()} />
                    <MetricRow label="Veteran (1+ year)" value={data.walletAge.veteran.toLocaleString()} />
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-purple-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <div>Analyzing wallet age...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Holders Leaderboard */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🏆</span>
              Top 10 Holders
            </h2>
            {data.topHolders.length > 0 ? (
              <div className="space-y-3">
                {data.topHolders.slice(0, 10).map((holder, index) => (
                  <div key={holder.address} className="flex items-center justify-between py-2 border-b border-white/10">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                      <span className="text-purple-200 font-mono text-sm">
                        {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                      </span>
                    </div>
                    <span className="text-white font-bold">{holder.balance} NFTs</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-purple-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <div>Loading leaderboard...</div>
                </div>
              </div>
            )}
          </div>

          {/* Top Tokens Held */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">💎</span>
              Popular Tokens
            </h2>
            {data.topTokens.length > 0 ? (
              <div className="space-y-3">
                {data.topTokens.slice(0, 8).map((token, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-white/10">
                    <div>
                      <span className="text-white font-semibold">{token.symbol}</span>
                      <span className="text-purple-300 text-sm ml-2">{token.name}</span>
                    </div>
                    <span className="text-purple-200">{token.percentage}% holders</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-purple-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <div>Analyzing token holdings...</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            🚀 Real-Time Analytics Powered by Alchemy
          </h3>
          <p className="text-purple-100 text-lg mb-4">
            All data is fetched live from the Base blockchain and analyzed in real-time.
          </p>
          <ul className="text-purple-200 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>✅ {data.totalHolders} holders tracked</li>
            <li>✅ Holder distribution analysis</li>
            <li>✅ Wallet age & activity metrics</li>
            <li>✅ Token holdings insights</li>
            <li>✅ Top 10 holders leaderboard</li>
            <li>✅ Updates every 5 minutes</li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-8">
          <p className="text-purple-300">
            Built with ❤️ for the Snoozies Community • Powered by Alchemy & Base
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
    <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
      <span className="text-purple-200 text-sm">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
