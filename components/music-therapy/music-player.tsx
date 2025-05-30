"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface MusicPlayerProps {
  track: {
    id: string
    title: string
    artist: string
    duration: string
    coverUrl?: string
    audioUrl: string
  }
}

export function MusicPlayer({ track }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Create audio element
    const audio = new Audio(track.audioUrl)
    audioRef.current = audio

    // Set up event listeners
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration || 0)
    })

    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    // Set initial volume
    audio.volume = volume

    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      audio.pause()
      audio.src = ""
      audio.remove()
    }
  }, [track.audioUrl])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
        // Fallback for autoplay restrictions
        setIsPlaying(false)
      })
      animationRef.current = requestAnimationFrame(updateProgress)
    }

    setIsPlaying(!isPlaying)
  }

  const updateProgress = () => {
    if (!audioRef.current) return

    setCurrentTime(audioRef.current.currentTime)
    animationRef.current = requestAnimationFrame(updateProgress)
  }

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return

    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return

    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume || 0.7
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Parse duration string (e.g., "3:45") to seconds for display
  const getDurationInSeconds = () => {
    if (duration > 0) return duration

    const parts = track.duration.split(":")
    if (parts.length === 2) {
      const minutes = Number.parseInt(parts[0], 10)
      const seconds = Number.parseInt(parts[1], 10)
      return minutes * 60 + seconds
    }
    return 100 // Fallback
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <motion.div
        className="w-full md:w-48 aspect-square rounded-md overflow-hidden bg-[#F5E1DA]/50 dark:bg-gray-700"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <img
          src={track.coverUrl || "/placeholder.svg?height=200&width=200"}
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="flex-1 w-full">
        <div className="mb-4">
          <h3 className="text-xl font-medium">{track.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{track.artist}</p>
        </div>

        <div className="space-y-4 w-full">
          <div className="flex items-center space-x-2">
            <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={getDurationInSeconds()}
              step={0.1}
              onValueChange={handleTimeChange}
              className="flex-1"
            />
            <span className="text-xs w-10">{track.duration}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <SkipBack size={20} />
              </Button>
              <Button
                onClick={togglePlay}
                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white rounded-full w-12 h-12 flex items-center justify-center"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <SkipForward size={20} />
              </Button>
            </div>
            <div className="w-28 md:block hidden"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>
    </div>
  )
}

