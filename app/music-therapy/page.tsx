"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Play, Home, Send, BarChart3, Music } from "lucide-react"
import Link from "next/link"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { useAuth } from "@/lib/context/auth-context"
import { useMood } from "@/lib/hooks/use-mood"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MusicPlayer } from "@/components/music-therapy/music-player"
import { ActivityCard } from "@/components/music-therapy/activity-card"
import { getMusicRecommendations, getActivityRecommendations } from "@/lib/api/music-therapy"

export default function MusicTherapyPage() {
  const [activeTab, setActiveTab] = useState("music")
  const [musicRecommendations, setMusicRecommendations] = useState<any[]>([])
  const [activityRecommendations, setActivityRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { startTransition } = usePageTransition()
  const { user } = useAuth()
  const { moodHistory } = useMood()

  // Get the most recent mood
  const currentMood = moodHistory.length > 0 ? moodHistory[0].mood : "Neutral"

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true)
      try {
        const musicRecs = await getMusicRecommendations(user?.id || "anonymous", currentMood)
        const activityRecs = await getActivityRecommendations(user?.id || "anonymous", currentMood)

        setMusicRecommendations(musicRecs)
        setActivityRecommendations(activityRecs)
      } catch (error) {
        console.error("Error loading recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [user, currentMood])

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-[#333333] dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-[#6A9FB5]/10 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => startTransition("/dashboard")}
            >
              <ArrowLeft size={20} className="text-[#6A9FB5]" />
            </Button>
            <h1 className="font-semibold text-xl">Music & Activities</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm bg-[#F5E1DA] dark:bg-[#6A9FB5]/20 text-[#6A9FB5] px-3 py-1 rounded-full">
              Current Mood: {currentMood}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="music" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="bg-[#F5E1DA]/30 dark:bg-gray-800 w-full justify-start mb-6">
            <TabsTrigger value="music">Music Therapy</TabsTrigger>
            <TabsTrigger value="activities">Suggested Activities</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="music" className="mt-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <LoadingSpinner size="lg" className="text-[#6A9FB5]" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading music recommendations...</p>
                  </div>
                ) : (
                  <>
                    <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300 mb-8">
                      <CardHeader>
                        <CardTitle>Now Playing</CardTitle>
                        <CardDescription>Music selected to match your current mood</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MusicPlayer track={musicRecommendations[0]} />
                      </CardContent>
                    </Card>

                    <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {musicRecommendations.slice(1).map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border-[#6A9FB5]/20 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full">
                            <CardContent className="p-4">
                              <div className="aspect-square rounded-md bg-[#F5E1DA]/50 dark:bg-gray-700 mb-3 overflow-hidden">
                                <img
                                  src={track.coverUrl || "/placeholder.svg?height=200&width=200"}
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h3 className="font-medium">{track.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{track.artist}</p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-xs bg-[#F5E1DA] dark:bg-[#6A9FB5]/20 text-[#6A9FB5] px-2 py-1 rounded-full">
                                  {track.duration}
                                </span>
                                <Button
                                  size="sm"
                                  className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white rounded-full w-8 h-8 p-0"
                                >
                                  <Play size={16} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="activities" className="mt-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <LoadingSpinner size="lg" className="text-[#6A9FB5]" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading activity recommendations...</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Recommended Activities for {currentMood}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activityRecommendations.map((activity, index) => (
                        <ActivityCard key={activity.id} activity={activity} index={index} />
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 py-2 z-10">
        <div className="flex justify-around">
          <Link
            href="/dashboard"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/dashboard")
            }}
          >
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
          <Link href="/music-therapy" className="flex flex-col items-center p-2 text-[#6A9FB5]">
            <Music size={20} />
            <span className="text-xs mt-1">Therapy</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

