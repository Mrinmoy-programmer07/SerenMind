"use client"

import { useState, useEffect } from "react"
import type { MoodEntry, MoodInsight } from "@/lib/types"
import { useAuth } from "@/lib/context/auth-context"
import {
  getMoodHistory,
  saveMoodEntry as apiSaveMoodEntry,
  getMoodInsights,
  getMoodRecommendations,
} from "@/lib/api/mood"
import { db } from "@/lib/firebase"

export function useMood() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [insights, setInsights] = useState<MoodInsight[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week")
  const { user } = useAuth()

  useEffect(() => {
    // Load mood history when user or timeframe changes
    const loadMoodData = async () => {
      if (!user) {
        console.log('No user logged in');
        return;
      }

      if (!db) {
        console.error('Firebase is not initialized');
        return;
      }

      setIsLoading(true);
      try {
        console.log('Loading mood data for user:', user.uid);
        const history = await getMoodHistory(user.uid, timeframe);
        setMoodHistory(history);

        const moodInsights = await getMoodInsights(user.uid);
        setInsights(moodInsights);

        const moodRecommendations = await getMoodRecommendations(user.uid);
        setRecommendations(moodRecommendations);
      } catch (error) {
        console.error("Error loading mood data:", error);
        // Set empty states on error
        setMoodHistory([]);
        setInsights([]);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, [user, timeframe]);

  const saveMoodEntry = async (mood: string, notes?: string) => {
    if (!user) {
      throw new Error("User must be logged in to save mood entries");
    }

    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    try {
      setIsLoading(true);
      console.log('Saving mood entry for user:', user.uid);
      
      const newEntry = await apiSaveMoodEntry(user.uid, mood, notes);
      
      // Update local state
      setMoodHistory((prev) => [newEntry, ...prev]);

      // Get updated recommendations based on new mood
      const updatedRecommendations = await getMoodRecommendations(user.uid, mood);
      setRecommendations(updatedRecommendations);

      return newEntry;
    } catch (error) {
      console.error("Error saving mood entry:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    moodHistory,
    insights,
    recommendations,
    isLoading,
    timeframe,
    setTimeframe,
    saveMoodEntry,
  };
}

