"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { MoodEntry, Mood } from "@/lib/types"
import { getMoodColor } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"
import { getMoodEntries, addMoodEntry } from "@/lib/api/mood"
import { useToast } from "@/components/ui/use-toast"
import { EmotionSelector } from "@/components/chat/emotion-selector"

export function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load mood entries for the current month
  useEffect(() => {
    const loadMoodEntries = async () => {
      if (!user?.uid) return

      try {
        setIsLoading(true)
        const entries = await getMoodEntries(
          user.uid,
          currentDate.getFullYear(),
          currentDate.getMonth()
        )
        setMoodHistory(entries)
      } catch (error) {
        console.error("Error loading mood entries:", error)
        toast({
          title: "Error",
          description: "Failed to load mood entries. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMoodEntries()
  }, [user, currentDate, toast])

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  // Handle mood selection
  const handleMoodSelect = async (mood: string) => {
    if (!user?.uid) return

    try {
      const newEntry = await addMoodEntry(user.uid, mood as Mood)
      setMoodHistory(prev => [newEntry, ...prev])
      toast({
        title: "Mood recorded",
        description: `Your mood has been recorded as ${mood}.`,
      })
    } catch (error) {
      console.error("Error adding mood entry:", error)
      toast({
        title: "Error",
        description: "Failed to record mood. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Create a map of dates to moods for quick lookup
  const moodMap = new Map<string, MoodEntry>()
  moodHistory.forEach((entry) => {
    const dateKey = entry.date.toISOString().split("T")[0]
    moodMap.set(dateKey, entry)
  })

  // Generate calendar days for the current month
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Create an array of days to display
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          className="hover:bg-[#F5E1DA]/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="hover:bg-[#F5E1DA]/50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <TooltipProvider>
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />
            }

            const date = new Date(currentYear, currentMonth, day)
            const dateKey = date.toISOString().split("T")[0]
            const entry = moodMap.get(dateKey)
            const isToday = 
              day === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear()

            return (
              <Tooltip key={`day-${day}`}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`aspect-square rounded-full flex items-center justify-center text-xs cursor-pointer ${
                      isToday ? "ring-2 ring-[#6A9FB5]" : ""
                    }`}
                    style={{
                      backgroundColor: entry ? getMoodColor(entry.mood) : "transparent",
                      opacity: entry ? 1 : 0.3,
                    }}
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: entry ? 1 : 0.3 }}
                    transition={{ duration: 0.2, delay: i * 0.01 }}
                  >
                    {day}
                  </motion.div>
                </TooltipTrigger>
                {entry && (
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-medium">{entry.mood}</p>
                      <p className="text-xs">{date.toLocaleDateString()}</p>
                      {entry.notes && <p className="text-xs italic mt-1">"{entry.notes}"</p>}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>

      {/* Quick Mood Selection */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">How are you feeling today?</h3>
        <EmotionSelector onSelect={handleMoodSelect} />
      </div>
    </div>
  )
}

