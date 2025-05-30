"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceRecorderProps {
  isRecording: boolean
  toggleRecording: () => void
}

export function VoiceRecorder({ isRecording, toggleRecording }: VoiceRecorderProps) {
  return (
    <Button
      onClick={toggleRecording}
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full border-[#6A9FB5]/30 transition-all duration-300",
        isRecording
          ? "bg-[#F5E1DA] text-[#6A9FB5] border-[#F5E1DA] animate-pulse"
          : "hover:bg-[#F5E1DA]/50 hover:text-[#6A9FB5]",
      )}
    >
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="recording"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MicOff size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="not-recording"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Mic size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

