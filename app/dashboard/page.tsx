"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BarChart3, LineChart, Home, Send, Download, Music } from "lucide-react"
import Link from "next/link"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { useAuth } from "@/lib/context/auth-context"
import { useMood } from "@/lib/hooks/use-mood"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { WellnessScoreChart } from "@/components/dashboard/wellness-score-chart"
import { ActivitySummary } from "@/components/dashboard/activity-summary"
import { RecommendationCard } from "@/components/dashboard/recommendation-card"
import { MoodCalendar } from "@/components/dashboard/mood-calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { useWellnessMetrics } from "@/lib/hooks/use-wellness-metrics"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { startTransition } = usePageTransition()
  const { user, isLoading: authLoading } = useAuth()
  const { moodHistory, insights, recommendations, isLoading: moodLoading } = useMood()
  const { metrics, loading, error } = useWellnessMetrics()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Wellness Data",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in')
    }
  }, [authLoading, user, router])

  const recentActivities = [
    { name: "Breathing Exercise", date: "Today, 10:30 AM", duration: "5 min" },
    { name: "Mood Check-in", date: "Today, 9:15 AM", duration: "1 min" },
    { name: "Therapy Chat", date: "Yesterday, 8:45 PM", duration: "15 min" },
    { name: "Guided Meditation", date: "Yesterday, 7:30 AM", duration: "10 min" },
  ]

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data is being prepared for download.",
    })

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported successfully.",
      })
    }, 2000)
  }

  const navigateToMusicTherapy = () => {
    startTransition("/music-therapy")
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Get the top 4 topics by percentage
  const topTopics = Object.entries(metrics.percentages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  // Map topics to their respective icons and colors
  const topicConfig: { [key: string]: { icon: string; color: string } } = {
    sleep: { icon: "🌙", color: "bg-purple-100" },
    anxiety: { icon: "😰", color: "bg-red-100" },
    mood: { icon: "😊", color: "bg-yellow-100" },
    energy: { icon: "⚡", color: "bg-green-100" },
    stress: { icon: "😓", color: "bg-orange-100" },
    depression: { icon: "😔", color: "bg-blue-100" },
    happiness: { icon: "😄", color: "bg-pink-100" },
    motivation: { icon: "💪", color: "bg-indigo-100" },
    // Add more mappings as needed
  }

  // Default configuration for unknown topics
  const defaultConfig = { icon: "📊", color: "bg-gray-100" }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-[#333333] dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-[#6A9FB5]/10 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => startTransition("/")}
            >
              <ArrowLeft size={20} className="text-[#6A9FB5]" />
            </Button>
            <h1 className="font-semibold text-xl">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#F5E1DA]/50 hover:text-[#6A9FB5] transition-colors"
              onClick={handleExportData}
            >
              <Download size={16} className="mr-1" />
              <span className="hidden sm:inline">Export Data</span>
            </Button>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container mx-auto px-4 py-8 max-w-6xl pb-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <LoadingSpinner size="lg" className="text-[#6A9FB5]" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Button
                  className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => startTransition("/chat")}
                >
                  <Send size={24} />
                  <span>Start Chat</span>
                </Button>
                <Button
                  className="bg-[#A3D9A5] hover:bg-[#6A9FB5] text-white h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => startTransition("/mood-tracker")}
                >
                  <BarChart3 size={24} />
                  <span>Track Mood</span>
                </Button>
                <Button
                  className="bg-[#F5E1DA] hover:bg-[#6A9FB5] text-[#6A9FB5] hover:text-white h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={navigateToMusicTherapy}
                >
                  <Music size={24} />
                  <span>Music Therapy</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => startTransition("/profile")}
                >
                  <LineChart size={24} />
                  <span>View Profile</span>
                </Button>
              </div>

              {/* Dashboard Tabs */}
              <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
                <TabsList className="bg-[#F5E1DA]/30 dark:bg-gray-800 w-full justify-start mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="overview" className="mt-0">
                      {/* Wellness Score */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="md:col-span-1 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Wellness Score</CardTitle>
                            <CardDescription>Your overall mental wellbeing</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <WellnessScoreChart score={metrics.overall} />
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                              Your wellness score has improved by 5% in the last week
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="md:col-span-2 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Wellness Metrics</CardTitle>
                            <CardDescription>Breakdown of your mental health factors</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {topTopics.map(([topic, percentage]) => {
                                const config = topicConfig[topic.toLowerCase()] || defaultConfig
                                return (
                                  <motion.div
                                    key={topic}
                                    className="space-y-1"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                      duration: 0.5,
                                      delay:
                                        topic === "sleep" ? 0.1 : topic === "anxiety" ? 0.2 : topic === "mood" ? 0.3 : 0.4,
                                    }}
                                  >
                                    <div className="flex justify-between">
                                      <span className="text-sm font-medium capitalize">{topic}</span>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</span>
                                    </div>
                                    <Progress
                                      value={percentage}
                                      className={`h-2 ${config.color}`}
                                    />
                                  </motion.div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Weekly Mood & Recent Activities */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Weekly Mood</CardTitle>
                            <CardDescription>Your emotional patterns for the past week</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              {moodHistory.length > 0 ? (
                                <div className="h-full w-full flex items-end justify-between">
                                  {moodHistory.slice(0, 7).map((entry, index) => (
                                    <motion.div
                                      key={entry.id}
                                      className="flex flex-col items-center"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                      <motion.div
                                        className="w-12 rounded-t-lg transition-all duration-500 hover:opacity-80"
                                        style={{
                                          backgroundColor:
                                            entry.mood === "Happy"
                                              ? "#6A9FB5"
                                              : entry.mood === "Calm"
                                                ? "#A3D9A5"
                                                : "#F5E1DA",
                                        }}
                                        initial={{ height: 0 }}
                                        animate={{
                                          height: `${entry.mood === "Happy"
                                            ? 90
                                            : entry.mood === "Calm"
                                              ? 70
                                              : entry.mood === "Neutral"
                                                ? 50
                                                : entry.mood === "Anxious"
                                                  ? 30
                                                  : 20
                                            }%`,
                                        }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                      />
                                      <div className="flex flex-col items-center mt-2">
                                        <span className="text-xs">
                                          {entry.date.toLocaleDateString("en-US", { weekday: "short" })}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{entry.mood}</span>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <div className="text-center">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">No mood data available yet</p>
                                    <Button
                                      onClick={() => startTransition("/mood-tracker")}
                                      className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white"
                                    >
                                      Start Tracking
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="md:col-span-1 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>Your latest wellness activities</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {recentActivities.map((activity, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="flex justify-between items-start border-b border-[#6A9FB5]/10 pb-3 last:border-0"
                                >
                                  <div>
                                    <p className="font-medium">{activity.name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.date}</p>
                                  </div>
                                  <span className="text-xs bg-[#F5E1DA] dark:bg-[#6A9FB5]/20 text-[#6A9FB5] px-2 py-1 rounded-full">
                                    {activity.duration}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="mood" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Mood Patterns</CardTitle>
                            <CardDescription>Analysis of your emotional trends</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <h4 className="text-sm font-medium">Most Common Moods</h4>
                                <div className="flex gap-2">
                                  {["Calm", "Happy", "Anxious"].map((mood) => (
                                    <motion.div
                                      key={mood}
                                      className="px-3 py-1 rounded-full text-xs"
                                      style={{
                                        backgroundColor:
                                          mood === "Happy" ? "#6A9FB5" : mood === "Calm" ? "#A3D9A5" : "#F5E1DA",
                                        color: mood === "Happy" ? "white" : "#333333",
                                      }}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {mood}
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>

                              <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <h4 className="text-sm font-medium">Mood Triggers</h4>
                                <ul className="text-sm space-y-1">
                                  <li>• Work stress (mentioned 8 times)</li>
                                  <li>• Sleep quality (mentioned 5 times)</li>
                                  <li>• Social interactions (mentioned 3 times)</li>
                                </ul>
                              </motion.div>

                              <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                <h4 className="text-sm font-medium">AI Insights</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Your mood tends to improve on weekends and after completing breathing exercises.
                                  Consider scheduling more relaxation activities during weekdays.
                                </p>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Mood Calendar</CardTitle>
                            <CardDescription>Your daily emotional check-ins</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <MoodCalendar moodHistory={moodHistory} />
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="activities" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Activity Summary</CardTitle>
                            <CardDescription>Your wellness activities this month</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ActivitySummary />
                          </CardContent>
                        </Card>

                        <Card className="md:col-span-2 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle>Activity Impact</CardTitle>
                            <CardDescription>How activities affect your mood</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                  {
                                    name: "Breathing Exercises",
                                    impact: "High Positive",
                                    description: "Shows consistent mood improvement after sessions",
                                  },
                                  {
                                    name: "Guided Meditation",
                                    impact: "Moderate Positive",
                                    description: "Helps with anxiety reduction",
                                  },
                                  {
                                    name: "Therapy Chats",
                                    impact: "High Positive",
                                    description: "Most effective for processing difficult emotions",
                                  },
                                  {
                                    name: "Journaling",
                                    impact: "Moderate Positive",
                                    description: "Helps with self-reflection and awareness",
                                  },
                                ].map((activity, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#6A9FB5]/10 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                  >
                                    <h4 className="font-medium mb-1">{activity.name}</h4>
                                    <div className="flex items-center mb-2">
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#A3D9A5]/20 text-[#A3D9A5] dark:bg-[#A3D9A5]/10">
                                        {activity.impact}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                                  </motion.div>
                                ))}
                              </div>

                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="bg-[#F5E1DA]/30 dark:bg-gray-800 p-4 rounded-lg"
                              >
                                <h4 className="font-medium mb-2">AI Recommendation</h4>
                                <p className="text-sm">
                                  Based on your activity impact, we recommend increasing your breathing exercises to at
                                  least 3 times per week for optimal mood improvement.
                                </p>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            title: "Morning Routine",
                            description: "Start your day with intention",
                            activities: ["5-minute breathing exercise", "Positive affirmations", "Quick mood check-in"],
                            icon: "🌅",
                          },
                          {
                            title: "Stress Management",
                            description: "Tools for anxiety reduction",
                            activities: [
                              "Guided meditation for anxiety",
                              "Progressive muscle relaxation",
                              "Cognitive reframing exercise",
                            ],
                            icon: "🧘‍♀️",
                          },
                          {
                            title: "Evening Wind-Down",
                            description: "Prepare for restful sleep",
                            activities: ["Gratitude journaling", "Sleep story meditation", "Digital sunset routine"],
                            icon: "🌙",
                          },
                        ].map((recommendation, index) => (
                          <RecommendationCard key={index} recommendation={recommendation} index={index} />
                        ))}
                      </div>

                      <Card className="mt-6 border-[#6A9FB5]/20 hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle>Personalized Wellness Plan</CardTitle>
                          <CardDescription>AI-generated plan based on your data</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                {
                                  title: "Focus Areas",
                                  items: ["Anxiety management", "Sleep improvement", "Work-life balance"],
                                  colors: ["#6A9FB5", "#A3D9A5", "#F5E1DA"],
                                },
                                {
                                  title: "Weekly Goals",
                                  items: ["3 breathing sessions", "2 guided meditations", "Daily mood tracking"],
                                  colors: ["#6A9FB5", "#A3D9A5", "#F5E1DA"],
                                },
                                {
                                  title: "Progress Metrics",
                                  items: ["Anxiety reduction", "Sleep quality", "Overall mood stability"],
                                  colors: ["#6A9FB5", "#A3D9A5", "#F5E1DA"],
                                },
                              ].map((section, sectionIndex) => (
                                <motion.div
                                  key={section.title}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#6A9FB5]/10 hover:shadow-md transition-all duration-300"
                                >
                                  <h4 className="font-medium mb-2">{section.title}</h4>
                                  <ul className="space-y-1 text-sm">
                                    {section.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex items-center">
                                        <span
                                          className="w-2 h-2 rounded-full mr-2"
                                          style={{ backgroundColor: section.colors[itemIndex] }}
                                        ></span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <Button
                                variant="outline"
                                className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300"
                                onClick={handleExportData}
                              >
                                Download Plan
                              </Button>
                              <Button
                                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300"
                                onClick={() => {
                                  toast({
                                    title: "Plan Started",
                                    description: "Your wellness plan has been activated.",
                                  })
                                }}
                              >
                                Start Plan
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </>
          )}
        </main>
      </ScrollArea>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 py-2 z-10">
        <div className="flex justify-around">
          <Link href="/dashboard" className="flex flex-col items-center p-2 text-[#6A9FB5]">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/chat"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/chat")
            }}
          >
            <Send size={20} />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          <Link
            href="/mood-tracker"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/mood-tracker")
            }}
          >
            <BarChart3 size={20} />
            <span className="text-xs mt-1">Mood</span>
          </Link>
          <Link
            href="/music-therapy"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/music-therapy")
            }}
          >
            <Music size={20} />
            <span className="text-xs mt-1">Therapy</span>
          </Link>
        </div>
      </div>
    </div>
  )
}