import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

interface MoodData {
  moodScore: number;
  sentiment: string;
  topics: string[];
}

/**
 * Saves mood data to Firestore under the user's mental_metrics subcollection
 * @param userId - The current user's ID
 * @param moodData - Object containing moodScore, sentiment, and topics
 * @returns Promise that resolves with the document reference
 */
export async function saveMoodData(
  userId: string,
  { moodScore, sentiment, topics }: MoodData
): Promise<void> {
  try {
    // Validate input data
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (typeof moodScore !== 'number' || moodScore < 0 || moodScore > 10) {
      throw new Error('Mood score must be a number between 0 and 10');
    }
    if (typeof sentiment !== 'string' || !sentiment.trim()) {
      throw new Error('Sentiment is required and must be a non-empty string');
    }
    if (!Array.isArray(topics)) {
      throw new Error('Topics must be an array');
    }

    // Reference to the mental_metrics subcollection
    const mentalMetricsRef = collection(db, 'users', userId, 'mental_metrics');

    // Create the document data
    const moodData = {
      moodScore,
      sentiment: sentiment.trim(),
      topics,
      timestamp: serverTimestamp(),
    };

    // Add the document to Firestore
    const docRef = await addDoc(mentalMetricsRef, moodData);
    console.log('Mood data saved successfully with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving mood data:', error);
    throw error; // Re-throw the error for the caller to handle
  }
} 