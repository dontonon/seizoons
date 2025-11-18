'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DeFiProtocolUsage as DeFiProtocolUsageType } from '@/lib/types';

/**
 * DeFiProtocolUsage Component
 *
 * Displays which DeFi protocols the community uses onchain:
 * - Top protocols by user count
 * - Percentage of holders using each protocol
 * - Visual bar chart showing adoption
 */
interface DeFiProtocolUsageProps {
  protocols: DeFiProtocolUsageType[];
  defiAdoption: number; // Overall % of holders using any DeFi
}

export default function DeFiProtocolUsage({ protocols, defiAdoption }: DeFiProtocolUsageProps) {
  // Prepare data for chart
  const chartData = protocols.map(p => ({
    name: p.protocolName,
    users: p.userCount,
    percentage: p.percentage,
  }));

  // Get colors for different protocols
  const getProtocolColor = (name: string) => {
    const colors: { [key: string]: string } = {
      'Uniswap': '#FF007A',
      'Aerodrome': '#3b82f6',
      'BaseSwap': '#8b5cf6',
      'Aave': '#B6509E',
      'Compound': '#00D395',
      'MorphoBlue': '#ec4899',
      'Stargate': '#f59e0b',
    };
    return colors[name] || '#6366f1';
  };

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          DeFi Protocol Usage
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          What DeFi protocols is the community using onchain?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">DeFi Adoption</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {defiAdoption}%
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Holders actively using DeFi protocols
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Protocols Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {protocols.length}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Different DeFi protocols in use
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-pink-100 dark:bg-pink-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Protocol</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {protocols[0]?.protocolName || 'N/A'}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Most popular protocol
          </p>
        </div>
      </div>

      {/* Protocol Usage Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Protocol Adoption by Holders
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
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
                          Users: <span className="font-medium">{payload[0].payload.users}</span>
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
              <Bar dataKey="users" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getProtocolColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {defiAdoption}% of holders are active DeFi users on Base chain. The community shows strong engagement with decentralized finance protocols, especially DEXes and lending platforms.
        </p>

        {/* Protocol Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((protocol, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getProtocolColor(protocol.protocolName) }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {protocol.protocolName}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {protocol.userCount} users
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {protocol.percentage}% adoption
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
