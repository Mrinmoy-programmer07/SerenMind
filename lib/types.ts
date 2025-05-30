// Common types used throughout the application

export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export type Mood = 
  | "Happy" 
  | "Calm" 
  | "Neutral" 
  | "Anxious" 
  | "Stressed"
  | "Sad" 
  | "Angry"
  | "Tired"
  | "Confused"
  | "Hopeful"

export interface MoodEntry {
  id: string
  date: Date
  mood: Mood
  notes?: string
}

export interface MoodInsight {
  id: string
  title: string
  description: string
  type: "pattern" | "trigger" | "improvement"
}

export interface Activity {
  id: string
  name: string
  date: Date
  duration: string
  type: string
}

export interface WellnessScore {
  overall: number
  sleep: number
  anxiety: number
  mood: number
  energy: number
}

