'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { GeographicDistribution } from '@/lib/types';

interface GeographicHeatMapProps {
  data: GeographicDistribution;
}

export default function GeographicHeatMap({ data }: GeographicHeatMapProps) {
  // Prepare data for regional distribution chart
  const regionChartData = data.regions.map(region => ({
    name: region.region,
    holders: region.holderCount,
    percentage: region.percentage,
    timezone: region.timezone,
    peakHour: region.peakActivityHour,
    avgTxs: region.avgTransactionsPerDay,
  }));

  // Prepare data for 24-hour activity chart
  const hourlyChartData = data.hourlyActivity.map(hour => ({
    hour: `${hour.hour.toString().padStart(2, '0')}:00`,
    hourNum: hour.hour,
    transactions: hour.transactionCount,
    wallets: hour.activeWallets,
  }));

  // Color scale for regions based on holder count
  const maxHolders = Math.max(...data.regions.map(r => r.holderCount));
  const getRegionColor = (holderCount: number) => {
    const intensity = holderCount / maxHolders;
    if (intensity > 0.8) return '#8b5cf6'; // Purple
    if (intensity > 0.6) return '#a78bfa'; // Light purple
    if (intensity > 0.4) return '#c4b5fd'; // Lighter purple
    if (intensity > 0.2) return '#ddd6fe'; // Very light purple
    return '#ede9fe'; // Palest purple
  };

  // Format hour for tooltip
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          🗺️ Geographic Distribution
        </h2>
        <p className="text-purple-200">
          Community distribution across timezones inferred from transaction patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30">
          <div className="text-sm text-purple-200 mb-1">Top Region</div>
          <div className="text-2xl font-bold text-white">{data.topRegion}</div>
          <div className="text-xs text-purple-300 mt-1">Most holders</div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/30">
          <div className="text-sm text-blue-200 mb-1">Global Coverage</div>
          <div className="text-2xl font-bold text-white">{data.globalCoverage}%</div>
          <div className="text-xs text-blue-300 mt-1">From 3+ timezones</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 rounded-xl p-6 border border-cyan-500/30">
          <div className="text-sm text-cyan-200 mb-1">Diversity Score</div>
          <div className="text-2xl font-bold text-white">{data.diversityScore}/100</div>
          <div className="text-xs text-cyan-300 mt-1">Distribution evenness</div>
        </div>

        <div className="bg-gradient-to-br from-teal-600/20 to-green-600/20 rounded-xl p-6 border border-teal-500/30">
          <div className="text-sm text-teal-200 mb-1">Regions Tracked</div>
          <div className="text-2xl font-bold text-white">{data.regions.length}</div>
          <div className="text-xs text-teal-300 mt-1">Timezone zones</div>
        </div>
      </div>

      {/* Regional Distribution Bar Chart */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Holder Distribution by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'holders') {
                  return [
                    <>
                      <div><strong>Holders:</strong> {value} ({props.payload.percentage}%)</div>
                      <div><strong>Timezone:</strong> {props.payload.timezone}</div>
                      <div><strong>Peak Hour:</strong> {formatHour(props.payload.peakHour)} UTC</div>
                      <div><strong>Avg Txs/Day:</strong> {props.payload.avgTxs.toFixed(1)}</div>
                    </>,
                    ''
                  ];
                }
                return [value, name];
              }}
            />
            <Bar dataKey="holders" radius={[0, 8, 8, 0]}>
              {regionChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRegionColor(entry.holders)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 24-Hour Activity Pattern */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-2">24-Hour Global Activity Pattern (UTC)</h3>
        <p className="text-sm text-gray-400 mb-4">
          Transaction and wallet activity aggregated across all timezones
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="hour"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              interval={2}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'transactions') return [value, 'Transactions'];
                if (name === 'wallets') return [value, 'Active Wallets'];
                return [value, name];
              }}
              labelFormatter={(label: string, payload: any) => {
                if (payload && payload[0]) {
                  const hourNum = payload[0].payload.hourNum;
                  return `${formatHour(hourNum)} UTC`;
                }
                return label;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Transactions"
            />
            <Line
              type="monotone"
              dataKey="wallets"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 3 }}
              activeDot={{ r: 5 }}
              name="Active Wallets"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region Cards Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Region Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.regions.map((region, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white">{region.region}</h4>
                  <p className="text-sm text-gray-400">{region.timezone}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{region.percentage}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Holders:</span>
                  <span className="text-sm font-semibold text-white">{region.holderCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Peak Activity:</span>
                  <span className="text-sm font-semibold text-white">{formatHour(region.peakActivityHour)} UTC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Avg Txs/Day:</span>
                  <span className="text-sm font-semibold text-white">{region.avgTransactionsPerDay.toFixed(1)}</span>
                </div>
              </div>

              {/* Progress bar showing percentage */}
              <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: `${region.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-3">🔍 Geographic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-purple-200 mb-2">Timezone Inference Method</h4>
            <p className="text-gray-300">
              Geographic distribution is estimated by analyzing transaction timing patterns.
              Wallets with peak activity during specific UTC hours are grouped into corresponding timezones.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 mb-2">Global vs Regional Community</h4>
            <p className="text-gray-300">
              {data.globalCoverage}% of holders show activity across 3+ different timezones,
              indicating a truly global community. Diversity score of {data.diversityScore}/100
              shows {data.diversityScore > 70 ? 'strong' : data.diversityScore > 50 ? 'moderate' : 'concentrated'} geographic distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
