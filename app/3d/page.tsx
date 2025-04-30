"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Use dynamic import with no SSR for the Orbs component
// This prevents hydration issues with THREE.js which requires browser APIs
const DynamicOrbs = dynamic(() => import('@/components/Orbs'), {
  ssr: false,
  loading: () => <Loading />
})

// Simple loading component
function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-xl">Loading 3D Experience...</p>
        <p className="mt-2 text-sm text-gray-400">This may take a moment to initialize</p>
      </div>
    </div>
  )
}

export default function ThreeDPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only render the component client-side
  useEffect(() => {
    setMounted(true)
    
    // Set a timeout to detect if something went wrong with loading
    const timeoutId = setTimeout(() => {
      if (!document.querySelector('canvas')) {
        setError("It's taking longer than expected to load the 3D experience. You might have a slow connection or your device might not support this feature.")
      }
    }, 20000) // 20 seconds timeout
    
    return () => clearTimeout(timeoutId)
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-2 border border-pink-600 text-pink-600 rounded-md hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return <Loading />
  }

  return (
    <div className="relative min-h-screen">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <Link 
          href="/" 
          className="flex items-center px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      {/* Information overlay */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
        <div className="bg-black/40 backdrop-blur-sm text-white rounded-lg p-4 max-w-md mx-4">
          <h2 className="text-lg font-bold mb-2">Mother's Day Memories</h2>
          <p className="text-sm opacity-90">
            Explore this 3D gallery of motherhood moments. Each image represents love, care, and the beautiful journey of motherhood.
          </p>
        </div>
      </div>
      
      {/* Full-screen 3D visualization as background */}
      <div className="absolute inset-0 bg-black">
        {mounted && (
          <DynamicOrbs 
            totalImages={10} 
            totalItems={30} 
            sphereRadius={5} 
            backgroundColor="#111111" 
          />
        )}
      </div>
    </div>
  )
} 