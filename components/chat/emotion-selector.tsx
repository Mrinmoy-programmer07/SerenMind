"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EmotionSelectorProps {
  onSelect: (emotion: string) => void
}

export function EmotionSelector({ onSelect }: EmotionSelectorProps) {
  const emotions = [
    { name: "Happy", emoji: "😊" },
    { name: "Calm", emoji: "😌" },
    { name: "Anxious", emoji: "😰" },
    { name: "Stressed", emoji: "😫" },
    { name: "Sad", emoji: "😔" },
    { name: "Angry", emoji: "😠" },
    { name: "Tired", emoji: "😴" },
    { name: "Confused", emoji: "😕" },
    { name: "Hopeful", emoji: "🙂" },
  ]

  return (
    <ScrollArea className="max-w-3xl mx-auto px-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        {emotions.map((emotion) => (
          <motion.div key={emotion.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(emotion.name)}
              className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white whitespace-nowrap transition-all duration-300"
            >
              <span className="mr-1">{emotion.emoji}</span> {emotion.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}

