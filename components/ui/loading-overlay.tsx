"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message = "Loading..." }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <LoadingSpinner size="lg" className="text-[#6A9FB5] mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </motion.div>
    </motion.div>
  )
}

