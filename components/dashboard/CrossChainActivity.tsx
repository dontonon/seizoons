'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { ChainActivity } from '@/lib/types';

/**
 * CrossChainActivity Component
 *
 * Displays multi-chain activity showing where holders are active:
 * - Ethereum, Arbitrum, Polygon, Optimism, zkSync, Katana, Unichain, Base
 * - Active wallets per chain
 * - Multi-chain user identification
 * - Transaction volume and gas spending across chains
 * - Popular ERC20 tokens held by the community
 */
interface TokenData {
  tokenSymbol: string;
  tokenName: string;
  holderCount: number;
  holderPercentage: number;
}

interface CrossChainActivityProps {
  chains: ChainActivity[];
  multiChainUsers: number; // % active on 2+ chains
  tokens?: TokenData[]; // Optional popular tokens data
}

export default function CrossChainActivity({ chains, multiChainUsers, tokens }: CrossChainActivityProps) {
  // Prepare data for chain activity chart
  const chainData = chains.map(c => ({
    name: c.chainName,
    wallets: c.activeWallets,
    percentage: c.percentage,
    transactions: c.totalTransactions,
    gas: c.avgGasSpent,
  }));

  // Get chain-specific colors
  const getChainColor = (chainName: string) => {
    const colors: { [key: string]: string } = {
      'Base': '#0052FF', // Base blue
      'Ethereum': '#627EEA', // ETH purple
      'Arbitrum': '#28A0F0', // ARB blue
      'Polygon': '#8247E5', // MATIC purple
      'Optimism': '#FF0420', // OP red
      'zkSync': '#8C8DFC', // zkSync purple
      'Katana': '#EC4899', // Pink
      'Unichain': '#FF007A', // Uniswap pink
    };
    return colors[chainName] || '#6b7280';
  };

  // Get chain emoji/logo representation
  const getChainEmoji = (chainName: string) => {
    const emojis: { [key: string]: string } = {
      'Base': '⚡',
      'Ethereum': '♦️',
      'Arbitrum': '🔷',
      'Polygon': '🟣',
      'Optimism': '🔴',
      'zkSync': '⚫',
      'Katana': '⚔️',
      'Unichain': '🦄',
    };
    return emojis[chainName] || '🔗';
  };

  // Create pie chart data for multi-chain vs single-chain
  const userTypeData = [
    { name: 'Multi-Chain Users (2+ chains)', value: multiChainUsers, color: '#8b5cf6' },
    { name: 'Single-Chain Users', value: 100 - multiChainUsers, color: '#6b7280' },
  ];

  // Calculate total activity
  const totalTransactions = chains.reduce((sum, c) => sum + c.totalTransactions, 0);
  const totalActiveWallets = chains.reduce((sum, c) => sum + c.activeWallets, 0);

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cross-Chain Activity
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Where is the community active across EVM chains?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Multi-Chain Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {multiChainUsers}%
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Active on 2+ chains - true crypto natives
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chains Covered</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chains.length}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            EVM chains tracked in this analysis
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTransactions.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Across all tracked chains
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Wallets per Chain */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Wallets per Chain
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chainData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Active Wallets: <span className="font-medium">{payload[0].payload.wallets}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Adoption: <span className="font-medium">{payload[0].payload.percentage}%</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Transactions: <span className="font-medium">{payload[0].payload.transactions.toLocaleString()}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="wallets" radius={[0, 4, 4, 0]}>
                  {chainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getChainColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Number of holders active on each chain
          </p>
        </div>

        {/* Multi-Chain vs Single-Chain Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Multi-Chain User Breakdown
          </h3>
          <div className="h-96 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {multiChainUsers}% are multi-chain users showing sophisticated crypto experience
          </p>
        </div>
      </div>

      {/* Chain Details Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chain-by-Chain Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chains.map((chain, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg p-4 border-2 transition-all hover:shadow-lg"
              style={{ borderColor: getChainColor(chain.chainName) }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{getChainEmoji(chain.chainName)}</span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getChainColor(chain.chainName) }}
                />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {chain.chainName}
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Active:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {chain.activeWallets} ({chain.percentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Txs:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {chain.totalTransactions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Avg Gas:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {chain.avgGasSpent.toFixed(4)} ETH
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${chain.percentage}%`,
                    backgroundColor: getChainColor(chain.chainName),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>💡 Key Insight:</strong> {chains[1]?.percentage}% of holders are active on <strong>{chains[1]?.chainName}</strong>,
            showing strong cross-chain engagement beyond just Base. {multiChainUsers}% use multiple chains, indicating a sophisticated,
            crypto-native community that explores the entire EVM ecosystem.
          </p>
        </div>
      </div>

      {/* Popular ERC20 Tokens */}
      {tokens && tokens.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💎 Popular ERC20 Tokens Across Chains
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Top tokens held by the community - shows real DeFi engagement and cross-chain activity
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base">
                      {token.tokenSymbol}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {token.tokenName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {token.holderCount} holders
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {token.holderPercentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
