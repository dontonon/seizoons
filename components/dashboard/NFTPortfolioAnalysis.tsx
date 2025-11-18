'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { NFTCollection } from '@/lib/types';

interface NFTPortfolioAnalysisProps {
  collections: NFTCollection[];
}

export default function NFTPortfolioAnalysis({ collections }: NFTPortfolioAnalysisProps) {
  const chartData = collections.map(c => ({
    name: c.symbol,
    holders: c.holderCount,
    percentage: c.holderPercentage,
    fullName: c.name,
    floor: c.floorPrice,
    chain: c.chain,
  }));

  const blueChips = collections.filter(c => c.isBlueChip);
  const totalBlueChipHolders = blueChips.reduce((sum, c) => sum + c.holderCount, 0);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          NFT Portfolio Analysis
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Which other NFT collections does the community hold?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Collections Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{collections.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Blue Chips</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{blueChips.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Collection</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{collections[0]?.symbol}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Collection Adoption
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                      <p className="font-semibold">{payload[0].payload.fullName}</p>
                      <p className="text-sm">Holders: {payload[0].payload.holders}</p>
                      <p className="text-sm">Adoption: {payload[0].payload.percentage}%</p>
                      <p className="text-sm">Floor: {payload[0].payload.floor}Ξ</p>
                      <p className="text-sm">Chain: {payload[0].payload.chain}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="holders" fill="#8b5cf6">
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.floor && entry.floor > 5 ? '#f59e0b' : '#8b5cf6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((col, idx) => (
          <div key={idx} className={`rounded-lg p-4 border-2 ${col.isBlueChip ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900 dark:text-white">{col.symbol}</h4>
              {col.isBlueChip && <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Blue Chip</span>}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{col.name}</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Holders:</span>
                <span className="font-medium">{col.holderCount} ({col.holderPercentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Floor:</span>
                <span className="font-medium">{col.floorPrice}Ξ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chain:</span>
                <span className="font-medium">{col.chain}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>💡 Key Insight:</strong> {collections[0]?.holderPercentage}% hold <strong>{collections[0]?.name}</strong>, showing strong overlap with quality NFT projects. {blueChips.length} blue-chip collections represented indicates a sophisticated collector community.
        </p>
      </div>
    </div>
  );
}
