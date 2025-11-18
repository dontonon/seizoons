'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TransactionTiming } from '@/lib/types';

/**
 * TransactionTimingAnalytics Component
 *
 * Displays transaction timing patterns including:
 * - Hour of day distribution (peak activity times)
 * - Day of week distribution (weekday vs weekend patterns)
 * - Peak activity insights
 */
interface TransactionTimingAnalyticsProps {
  timing: TransactionTiming;
}

export default function TransactionTimingAnalytics({ timing }: TransactionTimingAnalyticsProps) {
  // Convert hour distribution to chart data (24 hours)
  const hourData = timing.hourDistribution.map((count, hour) => ({
    hour: hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`,
    count,
    hourNumber: hour,
  }));

  // Convert day distribution to chart data (7 days)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayData = timing.dayDistribution.map((count, day) => ({
    day: dayNames[day],
    count,
  }));

  // Find peak values for highlighting
  const maxHourCount = Math.max(...timing.hourDistribution);
  const maxDayCount = Math.max(...timing.dayDistribution);

  // Format peak hour for display
  const peakHourFormatted = timing.peakHour === 0
    ? '12am'
    : timing.peakHour < 12
    ? `${timing.peakHour}am`
    : timing.peakHour === 12
    ? '12pm'
    : `${timing.peakHour - 12}pm`;

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transaction Timing Analysis
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          When is the community most active onchain?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Peak Activity Hour</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {peakHourFormatted} UTC
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Most transactions happen around this time
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Peak Activity Day</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {timing.peakDay}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Community is most active on this day
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hour Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity by Hour (UTC)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={1}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {hourData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count === maxHourCount ? '#f59e0b' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Shows when holders are most active throughout the day
          </p>
        </div>

        {/* Day Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity by Day of Week
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count === maxDayCount ? '#f59e0b' : '#8b5cf6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Weekly activity patterns reveal community habits
          </p>
        </div>
      </div>
    </div>
  );
}
