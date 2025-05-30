"use client"

import { motion } from "framer-motion"

interface WellnessScoreChartProps {
  score: number
}

export function WellnessScoreChart({ score }: WellnessScoreChartProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#F5E1DA" strokeWidth="10" className="dark:opacity-20" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#6A9FB5"
            strokeWidth="10"
            strokeDasharray={`${score * 2.83} 283`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: "0 283" }}
            animate={{ strokeDasharray: `${score * 2.83} 283` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </svg>
      </div>
    </div>
  )
}

