"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface PageTransitionContextType {
  startTransition: (href: string) => void
  isTransitioning: boolean
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  const startTransition = (href: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push(href)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
    }, 300)
  }

  return (
    <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#6A9FB5]/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] flex items-center justify-center"
            >
              <span className="text-white font-bold text-2xl">S</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)
  if (context === undefined) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider")
  }
  return context
}

