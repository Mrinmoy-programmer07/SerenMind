"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Home, BarChart, Volume2, VolumeX, ArrowLeft, X, Music } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { useAuth } from "@/lib/context/auth-context"
import { useChat } from "@/lib/hooks/use-chat"
import { EmotionSelector } from "@/components/chat/emotion-selector"
import { VoiceRecorder } from "@/components/chat/voice-recorder"
import { ChatBubble } from "@/components/chat/chat-bubble"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatPage() {
  const { messages, sendMessage, isTyping, clearChat } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true) // Default to enabled
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { startTransition } = usePageTransition()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    sendMessage(inputValue)
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true)
          toast({
            title: "Recording started",
            description: "Speak clearly into your microphone.",
          })
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err)
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          })
        })
    } else {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    // In a real implementation, this would process the recorded audio
    // and convert it to text using a speech-to-text service
    toast({
      title: "Recording stopped",
      description: "Processing your voice input...",
    })

    // Simulate processing delay
    setTimeout(() => {
      const simulatedText = "This is a simulated voice input message."
      setInputValue(simulatedText)
      toast({
        title: "Voice processed",
        description: "Your voice has been converted to text.",
      })
    }, 1500)
  }

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled)
    toast({
      title: isSpeechEnabled ? "Voice response disabled" : "Voice response enabled",
      description: isSpeechEnabled ? "AI responses will no longer be read aloud." : "AI responses will be read aloud.",
    })
  }

  const handleEmotionSelect = (emotion: string) => {
    const emotionMessage = `I'm feeling ${emotion.toLowerCase()} today.`
    setInputValue(emotionMessage)

    // Optional: automatically send after selection
    setTimeout(() => {
      sendMessage(emotionMessage)
      setInputValue("")
    }, 500)
  }

  const handleClearChat = () => {
    clearChat()
    setShowClearConfirm(false)
    toast({
      title: "Chat cleared",
      description: "Your conversation has been cleared.",
    })
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-[#333333] dark:text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-[#6A9FB5]/10 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => startTransition("/dashboard")}
            >
              <ArrowLeft size={20} className="text-[#6A9FB5]" />
            </Button>
            <h1 className="font-semibold text-xl">AI Therapy Chat</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleSpeech}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-colors",
                isSpeechEnabled
                  ? "text-[#6A9FB5] hover:bg-[#6A9FB5]/10"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700",
              )}
              title={isSpeechEnabled ? "Disable voice response" : "Enable voice response"}
            >
              {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowClearConfirm(true)}
              title="Clear chat"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4 pb-20">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} isSpeechEnabled={isSpeechEnabled} />
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="bg-[#F5E1DA]/50 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-[#6A9FB5] animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-[#6A9FB5] animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-[#6A9FB5] animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Confirmation Dialog for Clear Chat */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2">Clear conversation?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This will delete all messages in this conversation. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearChat}>
                  Clear
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Emotion Selection */}
      <div className="bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 py-3 sticky bottom-16 md:bottom-0 z-10">
        <EmotionSelector onSelect={handleEmotionSelect} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 p-4 sticky bottom-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto flex items-end space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 resize-none border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5] min-h-[44px] max-h-32"
            rows={1}
          />
          <div className="flex space-x-2">
            <VoiceRecorder isRecording={isRecording} toggleRecording={toggleRecording} />
            <Button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === "" || isTyping}
              className={cn(
                "rounded-full transition-all duration-300 transform",
                inputValue.trim() === "" || isTyping
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white hover:shadow-md hover:-translate-y-1",
              )}
            >
              {isTyping ? <LoadingSpinner size="sm" /> : <Send size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 py-2 z-20">
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
          <Link href="/chat" className="flex flex-col items-center p-2 text-[#6A9FB5]">
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
            <BarChart size={20} />
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

