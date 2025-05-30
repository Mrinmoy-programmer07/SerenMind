// This file contains the mood tracking API functions
// In a real implementation, these would interact with a backend service

import type { MoodEntry, MoodInsight } from "@/lib/types"
import { collection, query, where, getDocs, addDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Simulated delay for API calls
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

// Get mood history
export async function getMoodHistory(
  userId: string,
  timeframe: "week" | "month" | "year" = "week",
): Promise<MoodEntry[]> {
  console.log('Getting mood history for user:', userId, 'timeframe:', timeframe);
  
  if (!db) {
    console.error('Firebase is not initialized');
    return [];
  }

  try {
    const moodRef = collection(db, 'users', userId, 'mood_entries');
    const q = query(moodRef, orderBy('date', 'desc'));
    
    console.log('Fetching mood entries from Firestore...');
    const querySnapshot = await getDocs(q);
    console.log('Found', querySnapshot.size, 'mood entries');
    
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      date: doc.data().date.toDate(),
      mood: doc.data().mood,
      notes: doc.data().notes,
    }));
    
    return entries;
  } catch (error) {
    console.error('Error fetching mood history:', error);
    return [];
  }
}

// Save a new mood entry
export async function saveMoodEntry(userId: string, mood: string, notes?: string): Promise<MoodEntry> {
  console.log('Saving mood entry for user:', userId, 'mood:', mood);
  
  if (!db) {
    console.error('Firebase is not initialized');
    throw new Error('Firebase is not initialized');
  }

  try {
    const moodRef = collection(db, 'users', userId, 'mood_entries');
    const docRef = await addDoc(moodRef, {
      date: Timestamp.now(),
      mood,
      notes,
    });
    
    console.log('Mood entry saved with ID:', docRef.id);
    
    return {
      id: docRef.id,
      date: new Date(),
      mood: mood as any,
      notes,
    };
  } catch (error) {
    console.error('Error saving mood entry:', error);
    throw error;
  }
}

// Get mood insights
export async function getMoodInsights(userId: string): Promise<MoodInsight[]> {
  if (!db) {
    console.error('Firebase is not initialized');
    return [];
  }

  try {
    // Import and use the new mood analysis function
    const { getMoodInsights: analyzeMoodInsights } = await import('./mood-analysis');
    return await analyzeMoodInsights(userId);
  } catch (error) {
    console.error('Error getting mood insights:', error);
    return [{
      id: 'error',
      title: 'Analysis Error',
      description: 'Unable to generate insights at this time. Please try again later.',
      type: 'pattern'
    }];
  }
}

// Get mood recommendations
export async function getMoodRecommendations(userId: string, currentMood?: string): Promise<any[]> {
  await simulateApiDelay()

  // In a real implementation, this would fetch personalized recommendations from a backend
  // For demo purposes, we'll return mock recommendations based on the current mood

  if (currentMood === "Anxious" || currentMood === "Stressed") {
    return [
      {
        id: "rec-1",
        title: "5-Minute Breathing Exercise",
        description: "A quick breathing technique to help reduce anxiety",
        type: "exercise",
        duration: "5 min",
      },
      {
        id: "rec-2",
        title: "Progressive Muscle Relaxation",
        description: "Tense and relax each muscle group to release physical tension",
        type: "exercise",
        duration: "10 min",
      },
    ]
  } else if (currentMood === "Sad") {
    return [
      {
        id: "rec-3",
        title: "Gratitude Journaling",
        description: "Write down three things you're grateful for to shift perspective",
        type: "activity",
        duration: "5 min",
      },
      {
        id: "rec-4",
        title: "Mood-Boosting Playlist",
        description: "Listen to uplifting music that can help improve your mood",
        type: "media",
        duration: "15 min",
      },
    ]
  } else {
    return [
      {
        id: "rec-5",
        title: "Mindfulness Meditation",
        description: "A guided meditation to help maintain emotional balance",
        type: "exercise",
        duration: "10 min",
      },
      {
        id: "rec-6",
        title: "Nature Walk",
        description: "Spending time in nature can help maintain positive mood",
        type: "activity",
        duration: "20 min",
      },
    ]
  }
}

// Get mood entries for a specific month
export async function getMoodEntries(userId: string, year: number, month: number): Promise<MoodEntry[]> {
  try {
    if (!db) {
      console.error('Firebase is not initialized');
      return [];
    }

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const moodRef = collection(db, 'users', userId, 'mood_entries');
    const q = query(
      moodRef,
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      date: doc.data().date.toDate(),
      mood: doc.data().mood as Mood,
      notes: doc.data().notes,
    }));
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return [];
  }
}

// Add a new mood entry
export async function addMoodEntry(
  userId: string,
  mood: Mood,
  notes?: string
): Promise<MoodEntry | null> {
  try {
    if (!db) {
      console.error('Firebase is not initialized');
      return null;
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!mood) {
      throw new Error('Mood is required');
    }

    const moodRef = collection(db, 'users', userId, 'mood_entries');
    
    // Create the document data with only valid fields
    const docData = {
      date: Timestamp.now(),
      mood,
      ...(notes && notes.trim() ? { notes: notes.trim() } : {}) // Only include non-empty notes
    };

    const docRef = await addDoc(moodRef, docData);
    
    console.log('Mood entry saved with ID:', docRef.id);
    
    return {
      id: docRef.id,
      date: new Date(),
      mood,
      ...(notes && notes.trim() ? { notes: notes.trim() } : {}) // Only include non-empty notes
    };
  } catch (error) {
    console.error('Error adding mood entry:', error);
    throw error;
  }
}

