"use client"

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/lib/context/auth-context';
import { getMentalMetrics, type MentalMetricWithId } from '@/lib/api/mental-metrics';
import { format } from 'date-fns';

interface ChartData {
  date: string;
  moodScore: number;
}

export function MoodChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('User must be logged in to view mood data');
        setIsLoading(false);
        return;
      }

      try {
        const metrics = await getMentalMetrics(user.uid);
        
        // Transform data for the chart
        const chartData = metrics
          .filter(metric => metric.timestamp && metric.moodScore)
          .map(metric => ({
            date: format(metric.timestamp, 'MMM d'),
            moodScore: metric.moodScore,
          }))
          .reverse(); // Show oldest to newest

        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mood data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No mood data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            domain={[0, 10]}
            tickCount={11}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
            }}
            formatter={(value: number) => [`${value}`, 'Mood Score']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="moodScore"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Example usage:
 * 
 * ```tsx
 * function MoodPage() {
 *   return (
 *     <div className="p-4">
 *       <h2 className="text-2xl font-bold mb-4">Mood History</h2>
 *       <MoodChart />
 *     </div>
 *   );
 * }
 * ```
 */

