"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseVoiceAssistantProps {
  enabled: boolean;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export function useVoiceAssistant({
  enabled = false,
  pitch = 1.1,
  rate = 0.9,
  volume = 1.0,
}: UseVoiceAssistantProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const { toast } = useToast();
  const lastUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const hasUserInteractedRef = useRef(false);

  // Function to handle user interaction
  const handleUserInteraction = useCallback(() => {
    hasUserInteractedRef.current = true;
  }, []);

  // Add event listeners for user interaction
  useEffect(() => {
    if (typeof window === "undefined") return;

    const events = ['click', 'keydown', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [handleUserInteraction]);

  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synthRef.current = synth;
    const availableVoices = synth.getVoices();

    if (availableVoices.length === 0) return;

    setVoices(availableVoices);

    const femaleVoice = availableVoices.find(
      (voice) =>
        ["female", "samantha", "victoria", "ava", "moira", "karen"].some((name) =>
          voice.name.toLowerCase().includes(name)
        ) && voice.lang.startsWith("en")
    );

    setSelectedVoice(femaleVoice || availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0]);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsAvailable(true);
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup function
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [loadVoices]);

  const resetSpeechSynthesis = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      if (synthRef.current.paused) {
        synthRef.current.resume();
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!enabled || !isAvailable || !text) return;

    if (!hasUserInteractedRef.current) {
      toast({
        title: "Voice Assistant",
        description: "Please interact with the page first to enable voice features.",
        variant: "default",
      });
      return;
    }

    try {
      const synth = window.speechSynthesis;
      synthRef.current = synth;

      // Reset speech synthesis state
      resetSpeechSynthesis();

      // Cancel any existing speech
      if (synth.speaking || synth.pending) {
        synth.cancel();
        // Add a slight delay to ensure cancellation is processed
        setTimeout(() => startSpeaking(), 200);
      } else {
        startSpeaking();
      }

      function startSpeaking() {
        const utterance = new SpeechSynthesisUtterance(text);
        lastUtteranceRef.current = utterance;

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = volume;

        utterance.onstart = () => {
          setIsSpeaking(true);
          retryCountRef.current = 0; // Reset retry count on successful start
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          retryCountRef.current = 0; // Reset retry count on successful completion
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          
          if ((event.error === "canceled" || event.error === "interrupted") && retryCountRef.current < MAX_RETRIES) {
            // Retry on cancellation or interruption
            retryCountRef.current++;
            setTimeout(() => {
              console.log(`Retrying speech synthesis (attempt ${retryCountRef.current})`);
              resetSpeechSynthesis();
              startSpeaking();
            }, 200);
            return;
          }

          if (event.error === "not-allowed") {
            console.error("Speech synthesis is not allowed. Ensure it is triggered by user interaction.");
            toast({
              title: "Speech Error",
              description: "Please interact with the page first to enable voice features.",
              variant: "destructive",
            });
          } else if (event.error === "canceled" || event.error === "interrupted") {
            console.log(`Speech synthesis was ${event.error}`);
            // Don't show toast for intentional cancellations or interruptions
          } else if (event.error) {
            console.error("Speech synthesis error:", event.error);
            toast({
              title: "Speech Error",
              description: event.error,
              variant: "destructive",
            });
          } else {
            console.error("Speech synthesis error occurred.");
          }
        };

        // Ensure the speech synthesis is in a good state
        if (synth.paused) {
          synth.resume();
        }

        // Add a small delay before speaking to ensure the synthesis engine is ready
        setTimeout(() => {
          synth.speak(utterance);
        }, 50);
      }
    } catch (error: any) {
      console.error("Speech synthesis error:", error);
      toast({
        title: "Speech Error",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    }
  }, [enabled, isAvailable, selectedVoice, pitch, rate, volume, toast, resetSpeechSynthesis]);

  return { speak, isSpeaking, isAvailable, voices, selectedVoice };
}