// This file contains the chat API functions
// In a real implementation, these would interact with a backend service

import type { Message } from "@/lib/types";
import MoodGraph from '@/components/MoodGraph';
import { Auth, getAuth } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { analyzeAndSaveChatMetrics } from './mental-metrics';

// ✅ Google API Key (Replace with environment variable in production)
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

// Simulated delay for API calls
const simulateApiDelay = (min = 1000, max = 3000) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

// ✅ Personalized welcome chat history
export async function getChatHistory(userId: string): Promise<Message[]> {
  await simulateApiDelay(500, 1000);

  return [
    {
      id: "1",
      content: "Hello! I'm SerenMind, your AI wellness companion.  How are you feeling today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ];
}

// Save and return user message
export async function sendMessage(userId: string, content: string): Promise<Message> {
  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: "user",
    timestamp: new Date(),
  };
  return userMessage;
}

// ✅ Fetch AI Response using Google Gemini Pro
async function fetchGoogleAiResponse(userMessage: string): Promise<string> {
  if (!GOOGLE_API_KEY) {
    console.error("Google API key is missing");
    throw new Error("Google API key is missing. Please check your environment variables.");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: `You are Serenmind, a mental health AI companion. Your responses should be:
1. Empathetic and supportive
2. Natural and conversational
3. Focused on emotional well-being
4. Brief and to the point
5. Free of medical advice or diagnoses
6. Response should be in more crisp , witty and engaging manner

User message: ${userMessage}

Respond as a caring friend who listens and supports.`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 400,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    console.log("Sending request to Google AI API:", {
      url: apiUrl,
      body: JSON.stringify(requestBody, null, 2)
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { rawResponse: responseText };
      }

      console.error("Google AI API Error:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorData
      });
      
      if (response.status === 400) {
        throw new Error(`Invalid request to Google AI API: ${errorData.error?.message || 'Unknown error'}`);
      } else if (response.status === 401) {
        throw new Error("Unauthorized. Please check your Google API key.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Please check your Google API key permissions.");
      } else {
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse API response:", responseText);
      throw new Error("Invalid response from Google AI API");
    }
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected response format from Google AI API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch AI response");
  }
}

// Get AI response
export async function getAiResponse(userId: string, userMessage: string): Promise<Message> {
  try {
    // Check for API key first
    if (!GOOGLE_API_KEY) {
      console.error("Google API key is missing");
      return {
        id: Date.now().toString(),
        content: "I'm currently unable to respond due to a configuration issue. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
    }

    // Simulate API delay
    await simulateApiDelay();

    // Get AI response
    const aiResponse = await fetchGoogleAiResponse(userMessage);

    // Analyze and save mental metrics if auth is available
    if (auth) {
      await analyzeAndSaveChatMetrics(userMessage, auth);
    } else {
      console.warn('Firebase auth not initialized, skipping mental metrics analysis');
    }

    // Create and return AI message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
    };

    return aiMessage;
  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Return a more specific error message based on the error type
    let errorMessage = "I'm having trouble connecting right now. Could you try again in a moment?";
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "I'm currently unable to respond due to a configuration issue. Please try again later.";
      } else if (error.message.includes("Invalid request")) {
        errorMessage = "I'm having trouble understanding that. Could you rephrase your message?";
      }
    }
    
    return {
      id: Date.now().toString(),
      content: errorMessage,
      sender: "ai",
      timestamp: new Date(),
    };
  }
}