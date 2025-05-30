// This file contains the music therapy API functions
// In a real implementation, these would interact with a backend service

// Simulated delay for API calls
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

// Get music recommendations based on mood
export async function getMusicRecommendations(userId: string, mood?: string): Promise<any[]> {
  await simulateApiDelay()

  // In a real implementation, this would fetch personalized music recommendations from a backend
  // For demo purposes, we'll return mock recommendations based on the current mood

  const moodBasedMusic: Record<string, any[]> = {
    Happy: [
      {
        id: "music-1",
        title: "Sunny Day Vibes",
        artist: "Mood Lifters",
        duration: "3:45",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎵",
        audioUrl: "https://example.com/audio/sunny-day.mp3",
        mood: "Happy",
      },
      {
        id: "music-2",
        title: "Upbeat Journey",
        artist: "Positive Rhythms",
        duration: "4:12",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎵",
        audioUrl: "https://example.com/audio/upbeat-journey.mp3",
        mood: "Happy",
      },
      {
        id: "music-3",
        title: "Joyful Morning",
        artist: "Sunrise Sounds",
        duration: "3:28",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎵",
        audioUrl: "https://example.com/audio/joyful-morning.mp3",
        mood: "Happy",
      },
      {
        id: "music-4",
        title: "Celebration",
        artist: "Happy Tunes",
        duration: "3:55",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎵",
        audioUrl: "https://example.com/audio/celebration.mp3",
        mood: "Happy",
      },
    ],
    Calm: [
      {
        id: "music-5",
        title: "Ocean Waves",
        artist: "Nature Sounds",
        duration: "5:20",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🌊",
        audioUrl: "https://example.com/audio/ocean-waves.mp3",
        mood: "Calm",
      },
      {
        id: "music-6",
        title: "Gentle Rain",
        artist: "Ambient Moods",
        duration: "6:15",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🌧️",
        audioUrl: "https://example.com/audio/gentle-rain.mp3",
        mood: "Calm",
      },
      {
        id: "music-7",
        title: "Peaceful Piano",
        artist: "Relaxing Keys",
        duration: "4:45",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎹",
        audioUrl: "https://example.com/audio/peaceful-piano.mp3",
        mood: "Calm",
      },
      {
        id: "music-8",
        title: "Meditation Bells",
        artist: "Zen Masters",
        duration: "7:30",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🔔",
        audioUrl: "https://example.com/audio/meditation-bells.mp3",
        mood: "Calm",
      },
    ],
    Anxious: [
      {
        id: "music-9",
        title: "Stress Relief",
        artist: "Anxiety Soothers",
        duration: "8:15",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🧘‍♀️",
        audioUrl: "https://example.com/audio/stress-relief.mp3",
        mood: "Anxious",
      },
      {
        id: "music-10",
        title: "Calming Frequencies",
        artist: "Binaural Beats",
        duration: "10:00",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎧",
        audioUrl: "https://example.com/audio/calming-frequencies.mp3",
        mood: "Anxious",
      },
      {
        id: "music-11",
        title: "Deep Breathing",
        artist: "Guided Relaxation",
        duration: "5:45",
        coverUrl: "/placeholder.svg?height=200&width=200&text=💨",
        audioUrl: "https://example.com/audio/deep-breathing.mp3",
        mood: "Anxious",
      },
      {
        id: "music-12",
        title: "Forest Sounds",
        artist: "Nature Therapy",
        duration: "9:20",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🌲",
        audioUrl: "https://example.com/audio/forest-sounds.mp3",
        mood: "Anxious",
      },
    ],
    Sad: [
      {
        id: "music-13",
        title: "Emotional Healing",
        artist: "Comfort Sounds",
        duration: "6:40",
        coverUrl: "/placeholder.svg?height=200&width=200&text=💙",
        audioUrl: "https://example.com/audio/emotional-healing.mp3",
        mood: "Sad",
      },
      {
        id: "music-14",
        title: "Gentle Comfort",
        artist: "Soothing Melodies",
        duration: "5:30",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🎵",
        audioUrl: "https://example.com/audio/gentle-comfort.mp3",
        mood: "Sad",
      },
      {
        id: "music-15",
        title: "Rainy Day",
        artist: "Melancholy Moods",
        duration: "4:55",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🌧️",
        audioUrl: "https://example.com/audio/rainy-day.mp3",
        mood: "Sad",
      },
      {
        id: "music-16",
        title: "Hope Ahead",
        artist: "Uplifting Transitions",
        duration: "5:15",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🌈",
        audioUrl: "https://example.com/audio/hope-ahead.mp3",
        mood: "Sad",
      },
    ],
    Neutral: [
      {
        id: "music-17",
        title: "Balanced Energy",
        artist: "Harmony Sounds",
        duration: "4:30",
        coverUrl: "/placeholder.svg?height=200&width=200&text=⚖️",
        audioUrl: "https://example.com/audio/balanced-energy.mp3",
        mood: "Neutral",
      },
      {
        id: "music-18",
        title: "Mindful Moment",
        artist: "Present Awareness",
        duration: "5:10",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🧠",
        audioUrl: "https://example.com/audio/mindful-moment.mp3",
        mood: "Neutral",
      },
      {
        id: "music-19",
        title: "Gentle Focus",
        artist: "Concentration Aids",
        duration: "6:25",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🔍",
        audioUrl: "https://example.com/audio/gentle-focus.mp3",
        mood: "Neutral",
      },
      {
        id: "music-20",
        title: "Ambient Flow",
        artist: "Background Harmony",
        duration: "7:15",
        coverUrl: "/placeholder.svg?height=200&width=200&text=🌊",
        audioUrl: "https://example.com/audio/ambient-flow.mp3",
        mood: "Neutral",
      },
    ],
  }

  // Return music based on mood, or default to Neutral if mood not found
  return moodBasedMusic[mood || "Neutral"] || moodBasedMusic.Neutral
}

// Get activity recommendations based on mood
export async function getActivityRecommendations(userId: string, mood?: string): Promise<any[]> {
  await simulateApiDelay()

  // In a real implementation, this would fetch personalized activity recommendations from a backend
  // For demo purposes, we'll return mock recommendations based on the current mood

  const moodBasedActivities: Record<string, any[]> = {
    Happy: [
      {
        id: "activity-1",
        title: "Gratitude Journaling",
        description: "Enhance your positive mood by reflecting on things you're grateful for.",
        duration: "10 min",
        category: "Mindfulness",
        benefits: ["Reinforces positive emotions", "Creates lasting happiness", "Improves self-awareness"],
        steps: [
          "Find a quiet space where you won't be disturbed",
          "Write down 3-5 things you're grateful for today",
          "For each item, explain why it brings you joy",
          "Reflect on how these positive elements affect your life",
        ],
        icon: "journaling",
      },
      {
        id: "activity-2",
        title: "Joy Sharing",
        description: "Share your positive energy with someone else to multiply your happiness.",
        duration: "15 min",
        category: "Social",
        benefits: ["Strengthens relationships", "Extends positive feelings", "Creates meaningful connections"],
        steps: [
          "Think of someone who might need a mood boost",
          "Reach out via call, text, or in person",
          "Share something positive or offer a compliment",
          "Listen and engage genuinely",
        ],
        icon: "nature",
      },
    ],
    Calm: [
      {
        id: "activity-3",
        title: "Progressive Muscle Relaxation",
        description: "Maintain your calm state by releasing any remaining tension in your body.",
        duration: "15 min",
        category: "Relaxation",
        benefits: ["Deepens physical relaxation", "Increases body awareness", "Enhances calm state"],
        steps: [
          "Find a comfortable position lying down",
          "Tense each muscle group for 5 seconds, then release",
          "Work from toes to head, noticing the difference between tension and relaxation",
          "End with deep breathing",
        ],
        icon: "meditation",
      },
      {
        id: "activity-4",
        title: "Mindful Tea Ritual",
        description: "Use all your senses to enjoy a calming cup of herbal tea.",
        duration: "10 min",
        category: "Mindfulness",
        benefits: ["Encourages present-moment awareness", "Extends relaxation", "Creates a calming ritual"],
        steps: [
          "Prepare your favorite herbal tea (chamomile, lavender, or mint work well)",
          "Notice the colors, smells, and sounds as you prepare it",
          "Feel the warmth of the cup in your hands",
          "Sip slowly, focusing entirely on the experience",
        ],
        icon: "nature",
      },
    ],
    Anxious: [
      {
        id: "activity-5",
        title: "4-7-8 Breathing Exercise",
        description: "A powerful breathing technique to quickly calm your nervous system.",
        duration: "5 min",
        category: "Breathing",
        benefits: ["Reduces anxiety quickly", "Activates parasympathetic nervous system", "Can be done anywhere"],
        steps: [
          "Sit comfortably with your back straight",
          "Inhale quietly through your nose for 4 seconds",
          "Hold your breath for 7 seconds",
          "Exhale completely through your mouth for 8 seconds",
          "Repeat 4-6 times",
        ],
        icon: "breathing",
      },
      {
        id: "activity-6",
        title: "Grounding Exercise",
        description: "Use your five senses to anchor yourself in the present moment.",
        duration: "5 min",
        category: "Mindfulness",
        benefits: ["Interrupts anxiety cycle", "Brings awareness to the present", "Calms racing thoughts"],
        steps: [
          "Name 5 things you can see",
          "Name 4 things you can touch or feel",
          "Name 3 things you can hear",
          "Name 2 things you can smell",
          "Name 1 thing you can taste",
        ],
        icon: "meditation",
      },
    ],
    Sad: [
      {
        id: "activity-7",
        title: "Gentle Movement",
        description: "Light physical activity to release endorphins and improve your mood.",
        duration: "15 min",
        category: "Exercise",
        benefits: [
          "Releases mood-boosting endorphins",
          "Provides distraction from negative thoughts",
          "Increases energy",
        ],
        steps: [
          "Choose gentle movements like walking, stretching, or light yoga",
          "Start slowly and listen to your body",
          "Focus on how your body feels as you move",
          "Gradually increase intensity if it feels good",
        ],
        icon: "exercise",
      },
      {
        id: "activity-8",
        title: "Comfort Playlist",
        description: "Create a playlist of songs that bring you comfort or happy memories.",
        duration: "20 min",
        category: "Creative",
        benefits: [
          "Uses music to shift emotional state",
          "Creates a resource for future use",
          "Encourages emotional processing",
        ],
        steps: [
          "Think of songs that have positive associations or memories",
          "Create a playlist you can easily access",
          "Listen mindfully, allowing yourself to feel the emotions that arise",
          "Consider adding uplifting songs toward the end",
        ],
        icon: "art",
      },
    ],
    Neutral: [
      {
        id: "activity-9",
        title: "Mindfulness Meditation",
        description: "A simple meditation to increase awareness and mental clarity.",
        duration: "10 min",
        category: "Meditation",
        benefits: ["Improves focus", "Reduces stress", "Increases self-awareness"],
        steps: [
          "Find a comfortable seated position",
          "Focus your attention on your breath",
          "When your mind wanders, gently bring it back to your breath",
          "Continue for 10 minutes, gradually increasing time as you practice",
        ],
        icon: "meditation",
      },
      {
        id: "activity-10",
        title: "Nature Connection",
        description: "Spend time outdoors to refresh your mind and boost your mood.",
        duration: "20 min",
        category: "Outdoor",
        benefits: ["Reduces mental fatigue", "Improves mood", "Increases vitamin D"],
        steps: [
          "Find a natural setting (park, garden, or even a tree-lined street)",
          "Walk slowly, noticing the details around you",
          "Use all your senses to experience nature",
          "If possible, find a spot to sit quietly for a few minutes",
        ],
        icon: "nature",
      },
    ],
  }

  // Return activities based on mood, or default to Neutral if mood not found
  return moodBasedActivities[mood || "Neutral"] || moodBasedActivities.Neutral
}

