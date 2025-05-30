import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-gray-900">
      <LoadingSpinner size="lg" className="text-[#6A9FB5] mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
    </div>
  )
}

