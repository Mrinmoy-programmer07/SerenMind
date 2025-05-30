"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface RecommendationCardProps {
  recommendation: {
    title: string
    description: string
    activities: string[]
    icon: string
  }
  index: number
}

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const { toast } = useToast()

  const handleStartNow = () => {
    toast({
      title: `Starting ${recommendation.title}`,
      description: "Your activity is being prepared...",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{recommendation.title}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">{recommendation.description}</p>
            </div>
            <motion.span
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {recommendation.icon}
            </motion.span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            {recommendation.activities.map((activity, i) => (
              <motion.li
                key={i}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + i * 0.1 }}
              >
                <span className="text-[#A3D9A5] mr-2">✓</span>
                <span className="text-sm">{activity}</span>
              </motion.li>
            ))}
          </ul>
          <Button
            className="w-full bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 transform hover:-translate-y-1"
            onClick={handleStartNow}
          >
            Start Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

