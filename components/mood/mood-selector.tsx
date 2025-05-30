"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MoodSelectorProps {
  selectedMood: string | null
  onSelect: (mood: string) => void
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const moods = [
    { name: "Happy", emoji: "😊" },
    { name: "Calm", emoji: "😌" },
    { name: "Neutral", emoji: "😐" },
    { name: "Anxious", emoji: "😰" },
    { name: "Sad", emoji: "😔" },
    { name: "Angry", emoji: "😠" },
    { name: "Tired", emoji: "😴" },
    { name: "Confused", emoji: "😕" },
    { name: "Hopeful", emoji: "🙂" },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {moods.map((mood) => (
        <motion.button
          key={mood.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.name)}
          className={cn(
            "flex flex-col items-center p-4 rounded-xl transition-all duration-300 shadow-sm",
            selectedMood === mood.name
              ? "bg-[#6A9FB5]/10 border-2 border-[#6A9FB5] shadow-md"
              : "bg-white dark:bg-gray-800 border border-[#6A9FB5]/20 hover:border-[#6A9FB5]/50 hover:shadow-md",
          )}
        >
          <motion.span
            className="text-3xl mb-2"
            animate={{
              scale: selectedMood === mood.name ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: selectedMood === mood.name ? Number.POSITIVE_INFINITY : 0,
              repeatType: "reverse",
            }}
          >
            {mood.emoji}
          </motion.span>
          <span className="text-sm font-medium">{mood.name}</span>
        </motion.button>
      ))}
    </div>
  )
}

