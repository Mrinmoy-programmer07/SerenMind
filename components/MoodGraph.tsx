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
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';

interface MoodData {
  moodScore: number;
  timestamp: {
    toDate: () => Date;
  };
}

interface ChartData {
  date: string;
  moodScore: number;
}

export default function MoodGraph() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const mentalMetricsRef = collection(db, 'users', user.uid, 'mental_metrics');
        const q = query(mentalMetricsRef, orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);

        const data: ChartData[] = querySnapshot.docs.map((doc) => {
          const moodData = doc.data() as MoodData;
          return {
            date: format(moodData.timestamp.toDate(), 'MM/dd/yyyy'),
            moodScore: moodData.moodScore,
          };
        });

        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching mood data:', err);
        setError('Failed to load mood data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
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

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No mood data available
      </div>
    );
  }

  return (
    <div className="w-full h-64 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
            }}
            formatter={(value: number) => [`Mood: ${value}`, 'Score']}
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