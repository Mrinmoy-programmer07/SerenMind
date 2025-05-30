"use client"

import { useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { saveMentalMetrics } from '@/lib/api/mental-metrics';

interface MentalMetricsData {
  moodScore: number;
  sentiment: string;
  topics: string[];
}

export function useMentalMetrics() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const saveMetrics = async (data: MentalMetricsData) => {
    if (!user) {
      throw new Error('User must be logged in to save mental metrics');
    }

    setIsLoading(true);
    setError(null);

    try {
      const docId = await saveMentalMetrics(user.uid, data);
      return docId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save mental metrics';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveMetrics,
    isLoading,
    error,
  };
}

/**
 * Example usage in a React component:
 * 
 * ```typescript
 * function MentalMetricsForm() {
 *   const { saveMetrics, isLoading, error } = useMentalMetrics();
 * 
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     
 *     try {
 *       const metrics = {
 *         moodScore: 8,
 *         sentiment: 'positive',
 *         topics: ['work', 'family', 'health']
 *       };
 *       
 *       const docId = await saveMetrics(metrics);
 *       console.log('Metrics saved with ID:', docId);
 *     } catch (err) {
 *       console.error('Failed to save metrics:', err);
 *     }
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <div className="error">{error}</div>}
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? 'Saving...' : 'Save Metrics'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */ 