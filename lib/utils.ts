import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated formatTime function to handle both Date objects and number of seconds
export function formatTime(time: Date | number): string {
  if (time instanceof Date) {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle seconds format (for audio player)
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

export function getHeightForMood(mood: string): number {
  const moodHeights: Record<string, number> = {
    Happy: 90,
    Calm: 70,
    Neutral: 50,
    Anxious: 30,
    Sad: 20,
    Angry: 25,
    Tired: 35,
    Confused: 40,
    Hopeful: 75,
  }
  return moodHeights[mood] || 50
}

export function getMoodColor(mood: string): string {
  const moodColors: Record<string, string> = {
    Happy: "#6A9FB5",
    Calm: "#A3D9A5",
    Neutral: "#F5E1DA",
    Anxious: "#F5E1DA",
    Sad: "#F5E1DA",
    Angry: "#F5E1DA",
    Tired: "#F5E1DA",
    Confused: "#F5E1DA",
    Hopeful: "#A3D9A5",
  }
  return moodColors[mood] || "#F5E1DA"
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

