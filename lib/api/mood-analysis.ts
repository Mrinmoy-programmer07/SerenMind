import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MoodEntry, MoodInsight } from '@/lib/types';

interface MoodFrequency {
  [key: string]: number;
}

interface TimeBasedPattern {
  timeOfDay: string;
  mood: string;
  frequency: number;
}

interface TriggerPattern {
  trigger: string;
  mood: string;
  frequency: number;
}

// Get mood entries for analysis
async function getMoodEntriesForAnalysis(userId: string, days: number = 30): Promise<MoodEntry[]> {
  if (!db) {
    console.error('Firebase is not initialized');
    return [];
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moodRef = collection(db, 'users', userId, 'mood_entries');
    const q = query(
      moodRef,
      where('date', '>=', Timestamp.fromDate(startDate)),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      date: doc.data().date.toDate(),
      mood: doc.data().mood,
      notes: doc.data().notes,
    }));
  } catch (error) {
    console.error('Error fetching mood entries for analysis:', error);
    return [];
  }
}

// Analyze mood frequency
function analyzeMoodFrequency(entries: MoodEntry[]): MoodFrequency {
  const frequency: MoodFrequency = {};
  
  entries.forEach(entry => {
    frequency[entry.mood] = (frequency[entry.mood] || 0) + 1;
  });

  return frequency;
}

// Analyze time-based patterns
function analyzeTimePatterns(entries: MoodEntry[]): TimeBasedPattern[] {
  const patterns: { [key: string]: { [key: string]: number } } = {};
  
  entries.forEach(entry => {
    const hour = entry.date.getHours();
    const timeOfDay = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    
    if (!patterns[timeOfDay]) {
      patterns[timeOfDay] = {};
    }
    
    patterns[timeOfDay][entry.mood] = (patterns[timeOfDay][entry.mood] || 0) + 1;
  });

  return Object.entries(patterns).map(([timeOfDay, moodFreq]) => {
    const mostFrequentMood = Object.entries(moodFreq).reduce((a, b) => 
      (b[1] > a[1] ? b : a)
    );
    
    return {
      timeOfDay,
      mood: mostFrequentMood[0],
      frequency: mostFrequentMood[1]
    };
  });
}

// Analyze triggers from notes
function analyzeTriggers(entries: MoodEntry[]): TriggerPattern[] {
  const triggers: { [key: string]: { [key: string]: number } } = {};
  const commonTriggers = ['work', 'sleep', 'exercise', 'social', 'family', 'health'];
  
  entries.forEach(entry => {
    if (!entry.notes) return;
    
    const note = entry.notes.toLowerCase();
    commonTriggers.forEach(trigger => {
      if (note.includes(trigger)) {
        if (!triggers[trigger]) {
          triggers[trigger] = {};
        }
        triggers[trigger][entry.mood] = (triggers[trigger][entry.mood] || 0) + 1;
      }
    });
  });

  return Object.entries(triggers).map(([trigger, moodFreq]) => {
    const mostFrequentMood = Object.entries(moodFreq).reduce((a, b) => 
      (b[1] > a[1] ? b : a)
    );
    
    return {
      trigger,
      mood: mostFrequentMood[0],
      frequency: mostFrequentMood[1]
    };
  });
}

// Generate insights from analysis
function generateInsights(
  frequency: MoodFrequency,
  timePatterns: TimeBasedPattern[],
  triggers: TriggerPattern[]
): MoodInsight[] {
  const insights: MoodInsight[] = [];
  
  // Most common mood insight
  const mostCommonMood = Object.entries(frequency).reduce((a, b) => 
    (b[1] > a[1] ? b : a)
  );
  
  insights.push({
    id: 'common-mood',
    title: 'Most Common Mood',
    description: `You most frequently feel ${mostCommonMood[0].toLowerCase()}. This mood appears ${mostCommonMood[1]} times in your recent entries.`,
    type: 'pattern'
  });

  // Time-based pattern insights
  timePatterns.forEach(pattern => {
    if (pattern.frequency >= 3) {
      insights.push({
        id: `time-${pattern.timeOfDay.toLowerCase()}`,
        title: `${pattern.timeOfDay} Mood Pattern`,
        description: `You tend to feel ${pattern.mood.toLowerCase()} during ${pattern.timeOfDay.toLowerCase()} hours. Consider scheduling activities accordingly.`,
        type: 'pattern'
      });
    }
  });

  // Trigger-based insights
  triggers.forEach(trigger => {
    if (trigger.frequency >= 2) {
      insights.push({
        id: `trigger-${trigger.trigger}`,
        title: `${trigger.trigger.charAt(0).toUpperCase() + trigger.trigger.slice(1)} Impact`,
        description: `${trigger.trigger.charAt(0).toUpperCase() + trigger.trigger.slice(1)}-related situations often lead to feeling ${trigger.mood.toLowerCase()}.`,
        type: 'trigger'
      });
    }
  });

  return insights;
}

// Main function to get mood insights
export async function getMoodInsights(userId: string): Promise<MoodInsight[]> {
  try {
    const entries = await getMoodEntriesForAnalysis(userId);
    
    if (entries.length === 0) {
      return [{
        id: 'no-data',
        title: 'No Data Available',
        description: 'Track your mood for a few days to receive personalized insights.',
        type: 'pattern'
      }];
    }

    const frequency = analyzeMoodFrequency(entries);
    const timePatterns = analyzeTimePatterns(entries);
    const triggers = analyzeTriggers(entries);
    
    return generateInsights(frequency, timePatterns, triggers);
  } catch (error) {
    console.error('Error generating mood insights:', error);
    return [{
      id: 'error',
      title: 'Analysis Error',
      description: 'Unable to generate insights at this time. Please try again later.',
      type: 'pattern'
    }];
  }
} 