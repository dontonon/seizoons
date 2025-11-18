'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface GeographicData {
  region: string;
  holders: number;
  percentage: number;
}

interface GeographicDistribution {
  distribution: GeographicData[];
  totalMapped: number;
  timestamp: string;
  note?: string;
}

export default function GeographicHeatMap() {
  const [data, setData] = useState<GeographicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGeographicData() {
      try {
        const response = await fetch('/api/nft/geographic-distribution');
        if (!response.ok) {
          throw new Error('Failed to fetch geographic distribution');
        }
        const result: GeographicDistribution = await response.json();
        setData(result.distribution);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching geographic data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    fetchGeographicData();
  }, []);

  // Color palette for the bars (purple/blue gradient theme)
  const colors = [
    '#8b5cf6', // purple-500
    '#7c3aed', // purple-600
    '#6d28d9', // purple-700
    '#5b21b6', // purple-800
    '#4c1d95', // purple-900
    '#3730a3', // indigo-800
  ];

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">🌍</span>
          Holder Distribution by Region
        </h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-200">Loading geographic data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">🌍</span>
          Holder Distribution by Region
        </h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3">🌍</span>
        Holder Distribution by Region
      </h2>

      <div className="mb-4">
        <p className="text-sm text-purple-300 italic">
          Estimated distribution based on community activity patterns
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis
            type="number"
            stroke="#e9d5ff"
            tick={{ fill: '#e9d5ff' }}
          />
          <YAxis
            type="category"
            dataKey="region"
            stroke="#e9d5ff"
            tick={{ fill: '#e9d5ff' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#e9d5ff',
            }}
            labelStyle={{ color: '#e9d5ff' }}
            formatter={(value: number, name: string) => {
              if (name === 'holders') {
                const item = data.find(d => d.holders === value);
                return [
                  `${value} holders (${item?.percentage}%)`,
                  'Distribution'
                ];
              }
              return [value, name];
            }}
          />
          <Bar dataKey="holders" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={item.region}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-purple-200">
              {item.region}: {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
