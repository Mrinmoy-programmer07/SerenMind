"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, BarChart3, Home, Send, Settings, Info } from "lucide-react"
import Link from "next/link"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { useAuth } from "@/lib/context/auth-context"
import { useMood } from "@/lib/hooks/use-mood"
import { MoodSelector } from "@/components/mood/mood-selector"
import { MoodChart } from "@/components/mood/mood-chart"
import { MoodInsights } from "@/components/mood/mood-insights"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodNote, setMoodNote] = useState("")
  const { startTransition } = usePageTransition()
  const { user } = useAuth()
  const { moodHistory, insights, recommendations, isLoading, timeframe, setTimeframe, saveMoodEntry } = useMood()
  const { toast } = useToast()
  const [showInsights, setShowInsights] = useState(false)

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood)
  }

  const handleSubmitMood = async () => {
    if (!selectedMood) return

    try {
      await saveMoodEntry(selectedMood, moodNote || undefined)
      toast({
        title: "Mood saved",
        description: "Your mood has been recorded successfully.",
      })
      setSelectedMood(null)
      setMoodNote("")
    } catch (error) {
      toast({
        title: "Error saving mood",
        description: "There was a problem saving your mood. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleInsights = () => {
    setShowInsights(!showInsights)
  }

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
              onClick={() => startTransition("/")}
            >
              <ArrowLeft size={20} className="text-[#6A9FB5]" />
            </Button>
            <h1 className="font-semibold text-xl">Mood Tracker</h1>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-[#6A9FB5] hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 transition-colors"
                    onClick={toggleInsights}
                  >
                    <Info size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View AI insights about your mood patterns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#6A9FB5] hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => startTransition("/dashboard")}
            >
              <Calendar size={18} className="mr-1" />
              <span className="hidden sm:inline">Calendar View</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Today's Mood Section */}
        <section className="mb-10">
          <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Select your mood to track your emotional wellbeing</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodSelector selectedMood={selectedMood} onSelect={handleMoodSelection} />

              <AnimatePresence>
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 mt-6"
                  >
                    <Textarea
                      value={moodNote}
                      onChange={(e) => setMoodNote(e.target.value)}
                      placeholder="Add a note about how you're feeling (optional)"
                      className="w-full p-3 border border-[#6A9FB5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A9FB5] bg-white dark:bg-gray-800 resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={handleSubmitMood}
                      className="w-full bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Mood"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </section>

        {/* Mood History Section */}
        <section>
          <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Mood History</CardTitle>
                <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
                  <TabsList className="bg-[#F5E1DA]/30 dark:bg-gray-800">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Track your emotional patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <MoodChart moodHistory={moodHistory} timeframe={timeframe} />
              )}

              <AnimatePresence>
                {showInsights && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                  >
                    <MoodInsights insights={insights} recommendations={recommendations} />
                  </motion.div>
                )}
              </AnimatePresence>

              {!showInsights && (
                <div className="mt-8">
                  <Button
                    variant="outline"
                    onClick={toggleInsights}
                    className="w-full border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300"
                  >
                    View AI Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 py-2 z-10">
        <div className="flex justify-around">
          <Link
            href="/"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/")
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
          <Link href="/mood-tracker" className="flex flex-col items-center p-2 text-[#6A9FB5]">
            <BarChart3 size={20} />
            <span className="text-xs mt-1">Mood</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/settings")
            }}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

