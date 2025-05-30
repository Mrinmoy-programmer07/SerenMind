"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MoodInsight } from "@/lib/types"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface MoodInsightsProps {
  insights: MoodInsight[]
  recommendations: any[]
}

export function MoodInsights({ insights, recommendations }: MoodInsightsProps) {
  const { startTransition } = usePageTransition()

  // Group insights by type
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) {
      acc[insight.type] = [];
    }
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, MoodInsight[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI Insights</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Insights are generated based on your mood tracking history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {insights.length > 0 ? (
        <div className="space-y-6">
          {/* Patterns Section */}
          {groupedInsights.pattern && groupedInsights.pattern.length > 0 && (
            <div className="bg-[#6A9FB5]/10 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-[#6A9FB5] mb-3">Mood Patterns</h4>
              {groupedInsights.pattern.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={index > 0 ? "mt-4 pt-4 border-t border-[#6A9FB5]/10" : ""}
                >
                  <p className="text-sm">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Triggers Section */}
          {groupedInsights.trigger && groupedInsights.trigger.length > 0 && (
            <div className="bg-[#6A9FB5]/10 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-[#6A9FB5] mb-3">Mood Triggers</h4>
              {groupedInsights.trigger.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={index > 0 ? "mt-4 pt-4 border-t border-[#6A9FB5]/10" : ""}
                >
                  <p className="text-sm">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Improvements Section */}
          {groupedInsights.improvement && groupedInsights.improvement.length > 0 && (
            <div className="bg-[#6A9FB5]/10 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-[#6A9FB5] mb-3">Suggested Improvements</h4>
              {groupedInsights.improvement.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={index > 0 ? "mt-4 pt-4 border-t border-[#6A9FB5]/10" : ""}
                >
                  <p className="text-sm">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#6A9FB5]/10 dark:bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-sm">Track your mood regularly to receive personalized insights.</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.slice(0, 2).map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full border-[#6A9FB5]/20 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{recommendation.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-[#F5E1DA] dark:bg-[#6A9FB5]/20 text-[#6A9FB5] px-2 py-1 rounded-full">
                    {recommendation.duration}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{recommendation.type}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300"
                  onClick={() => startTransition("/dashboard")}
                >
                  Start Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

