"use client"

import { useState, useEffect, useCallback } from "react"
import type { Message } from "@/lib/types"
import { useAuth } from "@/lib/context/auth-context"
import { getChatHistory, sendMessage as apiSendMessage, getAiResponse } from "@/lib/api/chat"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!user) {
      // If no user, set default welcome message
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
      return
    }

    try {
      setError(null)
      const history = await getChatHistory(user.uid)
      setMessages(history)
    } catch (error) {
      console.error("Error loading chat history:", error)
      setError("Failed to load chat history. Please try again.")
      // Set default welcome message on error
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    }
  }, [user])

  // Load chat history when user changes
  useEffect(() => {
    loadChatHistory()
  }, [loadChatHistory])

  const sendMessage = async (content: string) => {
    if (!content.trim()) {
      return
    }

    try {
      setError(null)
      setIsTyping(true)

      // Add user message to state immediately for UI responsiveness
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content.trim(),
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      // Send message to API if user is authenticated
      if (user) {
        await apiSendMessage(user.uid, content.trim())
      }

      // Get AI response
      const aiMessage = await getAiResponse(user?.uid || "anonymous", content.trim())

      // Add AI response to state
      setMessages((prev) => [...prev, aiMessage])

      return aiMessage
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm having trouble connecting right now. Could you try again in a moment?",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      
      throw error
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = async () => {
    try {
      setError(null)
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error clearing chat:", error)
      setError("Failed to clear chat. Please try again.")
      throw error
    }
  }

  return {
    messages,
    sendMessage,
    isTyping,
    clearChat,
    error,
    reloadChat: loadChatHistory,
  }
}