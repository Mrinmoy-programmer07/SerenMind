"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { useAuth } from "@/lib/context/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { startTransition } = usePageTransition()
  const { user, isLoading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNavigation = (href: string) => {
    setPageLoading(true)
    startTransition(href)

    // Add a small delay to show loading state
    setTimeout(() => {
      setPageLoading(false)
    }, 500)
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-[#333333] dark:text-gray-100">
      <LoadingOverlay isLoading={pageLoading} message="Loading SerenMind..." />

      {/* Navigation */}
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#FAFAFA]/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
            : "bg-[#FAFAFA]/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-[#6A9FB5]/20",
        )}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] flex items-center justify-center group-hover:shadow-md transition-all duration-300"
            >
              <span className="text-white font-bold text-lg">S</span>
            </motion.div>
            <span className="font-semibold text-xl">SerenMind</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/chat"
              className="hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              onClick={(e) => {
                e.preventDefault()
                handleNavigation("/chat")
              }}
            >
              AI Therapy
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/mood-tracker"
              className="hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              onClick={(e) => {
                e.preventDefault()
                handleNavigation("/mood-tracker")
              }}
            >
              Mood Tracker
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/music-therapy"
              className="hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              onClick={(e) => {
                e.preventDefault()
                handleNavigation("/music-therapy")
              }}
            >
              Music Therapy
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {isLoading ? (
              <Button variant="outline" disabled className="border-[#6A9FB5] text-[#6A9FB5]">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Loading...</span>
              </Button>
            ) : user ? (
              <Button
                variant="outline"
                className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300"
                onClick={() => handleNavigation("/dashboard")}
              >
                My Dashboard
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300"
                onClick={() => handleNavigation("/sign-in")}
              >
                Sign In
              </Button>
            )}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center space-x-4">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#FAFAFA] dark:bg-gray-900 border-b border-[#6A9FB5]/20"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <Link
                  href="/chat"
                  className="py-2 hover:text-[#6A9FB5] transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    handleNavigation("/chat")
                  }}
                >
                  AI Therapy
                </Link>
                <Link
                  href="/mood-tracker"
                  className="py-2 hover:text-[#6A9FB5] transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    handleNavigation("/mood-tracker")
                  }}
                >
                  Mood Tracker
                </Link>
                <Link
                  href="/music-therapy"
                  className="py-2 hover:text-[#6A9FB5] transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    handleNavigation("/music-therapy")
                  }}
                >
                  Music Therapy
                </Link>
                {isLoading ? (
                  <Button variant="outline" disabled className="border-[#6A9FB5] text-[#6A9FB5] w-full">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Loading...</span>
                  </Button>
                ) : user ? (
                  <Button
                    variant="outline"
                    className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300 w-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleNavigation("/dashboard")
                    }}
                  >
                    My Dashboard
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transition-all duration-300 w-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleNavigation("/sign-in")
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute rounded-full opacity-20 dark:opacity-10",
                  i % 2 === 0 ? "bg-[#6A9FB5]" : "bg-[#A3D9A5]",
                )}
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: Math.random() * 10 + 10,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5]"
            >
              Your AI-Powered Mental Wellness Companion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl mb-10 text-gray-700 dark:text-gray-300"
            >
              Experience personalized mental health support through AI-driven therapy, mood tracking, and wellness
              exercises.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 text-lg py-6 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => handleNavigation(user ? "/chat" : "/sign-in")}
              >
                Start Chat
              </Button>
              <Button
                variant="outline"
                className="border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#F5E1DA] hover:text-[#6A9FB5] hover:border-[#F5E1DA] transition-all duration-300 text-lg py-6 px-8 rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-1"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-[#FAFAFA] to-[#F5E1DA]/30 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
          >
            How SerenMind Helps You
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI Therapy Chatbot",
                description:
                  "24/7 emotional support through our advanced AI that understands your feelings and provides personalized guidance.",
                icon: "🧠",
                link: "/chat",
              },
              {
                title: "Mood Tracking",
                description:
                  "Track your emotional patterns over time with visual analytics to better understand your mental health journey.",
                icon: "📊",
                link: "/mood-tracker",
              },
              {
                title: "Music Therapy",
                description: "Receive tailored music and meditation exercises based on your current emotional state.",
                icon: "🎵",
                link: "/music-therapy",
              },
              {
                title: "Anonymous & Secure",
                description:
                  "Your privacy matters. All conversations are encrypted and you can choose to remain anonymous.",
                icon: "🔒",
                link: "/sign-in",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#6A9FB5]/10 group hover:-translate-y-1 cursor-pointer"
                onClick={() => handleNavigation(feature.link)}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#6A9FB5] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Conversations That Understand You</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Our AI therapy chatbot uses advanced natural language processing to understand your emotions and provide
                empathetic, personalized support whenever you need it.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Anxiety", "Depression", "Stress", "Sleep Issues", "Mindfulness"].map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#F5E1DA] dark:bg-[#6A9FB5]/20 text-[#6A9FB5] px-4 py-2 rounded-full text-sm transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleNavigation("/chat")}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => handleNavigation(user ? "/chat" : "/sign-in")}
              >
                Try AI Therapy Now
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-[#6A9FB5]/10 max-w-md mx-auto hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Chat with SerenMind</h3>
                  <span className="w-3 h-3 bg-[#A3D9A5] rounded-full animate-pulse"></span>
                </div>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#F5E1DA]/50 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none max-w-[80%]"
                  >
                    <p className="text-sm">
                      Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-[#6A9FB5]/10 dark:bg-gray-700/50 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto"
                  >
                    <p className="text-sm">I've been feeling anxious about my upcoming presentation at work.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="bg-[#F5E1DA]/50 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none max-w-[80%]"
                  >
                    <p className="text-sm">
                      I understand presentation anxiety can be challenging. Would you like to try a quick breathing
                      exercise to help calm your nerves, or would you prefer to talk more about what's causing your
                      anxiety?
                    </p>
                  </motion.div>
                </div>
                <div className="mt-6 flex gap-2">
                  {["Breathing Exercise", "Let's Talk More", "Suggest Tips"].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs border-[#6A9FB5] text-[#6A9FB5] hover:bg-[#6A9FB5] hover:text-white transform hover:scale-105 transition-transform duration-300"
                      onClick={() => handleNavigation("/chat")}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Music Therapy Preview */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F5E1DA]/30 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Personalized Music Therapy</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Experience the healing power of music with personalized recommendations based on your emotional state.
                Our AI selects the perfect tracks to help you relax, focus, or uplift your mood.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Mood-based music recommendations",
                  "Guided meditation with soothing soundscapes",
                  "Breathing exercises with rhythmic accompaniment",
                  "Personalized playlists for different emotional states",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-[#A3D9A5] mr-2 transform hover:scale-110 transition-transform duration-300">
                      ✓
                    </span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Button
                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => handleNavigation(user ? "/music-therapy" : "/sign-in")}
              >
                Explore Music Therapy
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-[#6A9FB5]/10 max-w-md mx-auto hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="font-semibold mb-4">Music for Your Mood</h3>
                <div className="aspect-square rounded-md bg-[#F5E1DA]/50 dark:bg-gray-700 mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=200&text=🎵"
                    alt="Music Therapy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-medium">Calm Waters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Ambient Relaxation</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                  <div className="bg-[#6A9FB5] h-1.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <span>1:35</span>
                  <span>3:45</span>
                </div>
                <div className="flex justify-center">
                  <Button
                    className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white rounded-full w-12 h-12 flex items-center justify-center"
                    onClick={() => handleNavigation("/music-therapy")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mood Tracking Preview */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F5E1DA]/30 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Track Your Emotional Journey</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Visualize your mood patterns over time to gain insights into your emotional wellbeing. Our AI analyzes
                your data to provide personalized recommendations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Daily mood check-ins that take less than a minute",
                  "Visual graphs showing your emotional trends",
                  "AI-powered insights about your patterns",
                  "Personalized recommendations based on your data",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-[#A3D9A5] mr-2 transform hover:scale-110 transition-transform duration-300">
                      ✓
                    </span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Button
                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => handleNavigation("/mood-tracker")}
              >
                Start Tracking
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-[#6A9FB5]/10 max-w-md mx-auto hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="font-semibold mb-6">Your Mood Trends</h3>
                <div className="h-64 w-full bg-[#FAFAFA] dark:bg-gray-900 rounded-lg p-4 mb-6">
                  <div className="h-full w-full flex items-end justify-between">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                      const heights = [60, 40, 70, 30, 80, 50, 65]
                      const colors = [
                        "bg-[#F5E1DA]",
                        "bg-[#F5E1DA]",
                        "bg-[#A3D9A5]",
                        "bg-[#F5E1DA]",
                        "bg-[#A3D9A5]",
                        "bg-[#6A9FB5]",
                        "bg-[#6A9FB5]",
                      ]
                      return (
                        <motion.div
                          key={index}
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <motion.div
                            className={`w-8 ${colors[index]} rounded-t-lg transition-all duration-500 hover:opacity-80`}
                            style={{ height: `${heights[index]}%` }}
                            whileHover={{ scale: 1.05 }}
                          ></motion.div>
                          <span className="text-xs mt-2">{day}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-[#F5E1DA] rounded-full"></span>
                    <span className="text-xs">Anxious</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-[#A3D9A5] rounded-full"></span>
                    <span className="text-xs">Calm</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-[#6A9FB5] rounded-full"></span>
                    <span className="text-xs">Happy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] rounded-2xl p-10 md:p-16 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Wellness Journey Today</h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of users who have improved their mental wellbeing with SerenMind's AI-powered support
              system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-white text-[#6A9FB5] hover:bg-[#F5E1DA] hover:text-[#6A9FB5] transition-all duration-300 text-lg py-6 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => handleNavigation(user ? "/chat" : "/sign-in")}
              >
                Start Free Session
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/20 transition-all duration-300 text-lg py-6 px-8 rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-1"
                onClick={scrollToFeatures}
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#FAFAFA] dark:bg-gray-900 border-t border-[#6A9FB5]/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] flex items-center justify-center group-hover:shadow-md transition-all duration-300">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-lg">SerenMind</span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Your AI-Powered Mental Wellness Companion</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href="/about"
                className="text-sm hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              >
                About
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              >
                Privacy
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/terms"
                className="text-sm hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              >
                Terms
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-[#6A9FB5] transition-colors duration-300 relative group"
              >
                Contact
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#6A9FB5] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#6A9FB5]/10 text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} SerenMind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

