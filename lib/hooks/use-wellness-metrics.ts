import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface WellnessMetrics {
    topics: {
        [key: string]: number;
    };
    percentages: {
        [key: string]: number;
    };
    totalEntries: number;
}

export function useWellnessMetrics() {
    const [metrics, setMetrics] = useState<WellnessMetrics>({
        topics: {},
        percentages: {},
        totalEntries: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const fetchMetrics = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    console.log('No user signed in, skipping metrics fetch');
                    setLoading(false);
                    return;
                }

                console.log('Fetching metrics for user:', currentUser.uid);

                // First ensure user document exists
                const userRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (!userDoc.exists()) {
                    console.log('Creating user document for:', currentUser.uid);
                    await setDoc(userRef, {
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        lastActive: serverTimestamp()
                    });
                }

                // Set up real-time listener for mental metrics
                const metricsRef = collection(db, 'users', currentUser.uid, 'mental_metrics');
                const q = query(metricsRef, orderBy('timestamp', 'desc'));

                unsubscribe = onSnapshot(q,
                    (snapshot) => {
                        const topics: { [key: string]: number } = {};
                        let totalEntries = 0;

                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.topics && Array.isArray(data.topics)) {
                                data.topics.forEach((topic: string) => {
                                    topics[topic] = (topics[topic] || 0) + 1;
                                });
                                totalEntries++;
                            }
                        });

                        // Calculate percentages
                        const percentages: { [key: string]: number } = {};
                        Object.entries(topics).forEach(([topic, count]) => {
                            percentages[topic] = Math.round((count / totalEntries) * 100);
                        });

                        setMetrics({
                            topics,
                            percentages,
                            totalEntries
                        });
                        setLoading(false);
                    },
                    (error) => {
                        console.error('Error fetching metrics:', error);
                        setError(error.message);
                        setLoading(false);
                    }
                );
            } catch (error) {
                console.error('Error in useWellnessMetrics:', error);
                if (error instanceof Error) {
                    console.error('Error details:', {
                        message: error.message,
                        name: error.name,
                        stack: error.stack
                    });
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            }
        };

        fetchMetrics();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    return { metrics, loading, error };
} 