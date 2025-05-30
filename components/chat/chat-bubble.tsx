"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { useVoiceAssistant } from "@/lib/hooks/use-voice-assistant"

interface ChatBubbleProps {
  message: Message
  isSpeechEnabled: boolean
}

export function ChatBubble({ message, isSpeechEnabled }: ChatBubbleProps) {
  const { speak } = useVoiceAssistant({
    enabled: isSpeechEnabled,
    pitch: 1.1, // Slightly higher pitch for female voice
    rate: 0.9, // Slightly slower for soothing effect
  })

  useEffect(() => {
    if (message.sender === "ai" && isSpeechEnabled) {
      speak(message.content)
    }
  }, [message, isSpeechEnabled, speak])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300",
          message.sender === "user"
            ? "bg-[#6A9FB5] text-white rounded-tr-none"
            : "bg-[#F5E1DA]/50 dark:bg-gray-700 rounded-tl-none",
        )}
      >
        <p className="text-sm md:text-base">{message.content}</p>
        <p className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</p>
      </div>
    </motion.div>
  )
}

