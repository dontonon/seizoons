'use client';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌙 Snoozies NFT Dashboard
          </h1>
          <p className="text-xl text-purple-200">
            Community Analytics & Insights
          </p>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Holders"
            value="1,234"
            subtitle="Unique wallet addresses"
            icon="👥"
          />
          <StatCard
            title="Twitter Community"
            value="5,678"
            subtitle="Combined followers"
            icon="🐦"
          />
          <StatCard
            title="Onchain Activity"
            value="92%"
            subtitle="Active wallets (30d)"
            icon="⛓️"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Onchain Analytics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">⛓️</span>
              Onchain Analytics
            </h2>
            <div className="space-y-4">
              <MetricRow label="Average Wallet Age" value="8.5 months" />
              <MetricRow label="Total Transactions" value="45,230" />
              <MetricRow label="Unique Tokens Held" value="127" />
              <MetricRow label="Average Gas Spent" value="0.42 ETH" />
            </div>
          </div>

          {/* Twitter Metrics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🐦</span>
              Twitter Metrics
            </h2>
            <div className="space-y-4">
              <MetricRow label="Community Members" value="856" />
              <MetricRow label="Avg Followers/Member" value="6.6K" />
              <MetricRow label="Verified Accounts" value="23" />
              <MetricRow label="Total Reach" value="5.7M" />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            🚀 Dashboard is Live!
          </h3>
          <p className="text-purple-100 text-lg mb-4">
            This is your fresh Snoozies NFT Dashboard, ready to be connected to real data.
          </p>
          <ul className="text-purple-200 space-y-2">
            <li>✅ Built with Next.js 15 + TypeScript</li>
            <li>✅ Styled with Tailwind CSS</li>
            <li>✅ Ready for Vercel deployment</li>
            <li>🔄 Next step: Connect to live APIs (Mintify, Alchemy, Twitter)</li>
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
