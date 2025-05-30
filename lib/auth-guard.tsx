"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Pages that don't require authentication
const publicPages = ["/", "/sign-in"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for public pages
    if (publicPages.includes(pathname)) {
      return
    }

    // If not loading and no user, redirect to sign-in
    if (!isLoading && !user) {
      router.push("/sign-in?redirect=" + encodeURIComponent(pathname))
    }
  }, [user, isLoading, router, pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-gray-900">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <LoadingSpinner size="lg" className="text-[#6A9FB5] mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading SerenMind...</p>
      </div>
    )
  }

  // If on a protected page and not authenticated, don't render children
  if (!publicPages.includes(pathname) && !user) {
    return null
  }

  // Otherwise, render children
  return <>{children}</>
}

