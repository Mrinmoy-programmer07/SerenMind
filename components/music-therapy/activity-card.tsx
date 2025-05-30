"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Calendar, Award } from "lucide-react"

interface ActivityCardProps {
  activity: {
    id: string
    title: string
    description: string
    duration: string
    category: string
    benefits: string[]
    steps?: string[]
    icon: string
  }
  index: number
}

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const { toast } = useToast()

  const handleStartActivity = () => {
    toast({
      title: `Starting: ${activity.title}`,
      description: "Your activity is being prepared...",
    })
  }

  const getIconComponent = () => {
    switch (activity.icon) {
      case "meditation":
        return "🧘‍♀️"
      case "breathing":
        return "🫁"
      case "exercise":
        return "🏃‍♀️"
      case "journaling":
        return "📔"
      case "nature":
        return "🌳"
      case "art":
        return "🎨"
      default:
        return "✨"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{activity.title}</CardTitle>
            <motion.span
              className="text-3xl"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {getIconComponent()}
            </motion.span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{activity.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center text-xs bg-[#F5E1DA]/50 dark:bg-[#6A9FB5]/20 text-[#6A9FB5] px-2 py-1 rounded-full">
              <Clock size={12} className="mr-1" />
              {activity.duration}
            </div>
            <div className="flex items-center text-xs bg-[#A3D9A5]/20 text-[#A3D9A5] px-2 py-1 rounded-full">
              <Calendar size={12} className="mr-1" />
              {activity.category}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Award size={14} className="mr-1 text-[#6A9FB5]" />
              Benefits
            </h4>
            <ul className="space-y-1">
              {activity.benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  className="flex items-start text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + i * 0.1 }}
                >
                  <span className="text-[#A3D9A5] mr-2">✓</span>
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {activity.steps && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">How to do it:</h4>
              <ol className="space-y-1 list-decimal list-inside text-sm">
                {activity.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <Button
            className="w-full bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 transform hover:-translate-y-1"
            onClick={handleStartActivity}
          >
            Start Activity
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

