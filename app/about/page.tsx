"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AboutPage() {
  // Using useEffect to apply the fade-in animation after component mount
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center text-pink-600 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto">
        <div 
          className={`bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden mb-8 transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Image header with circular photo */}
          <div className="relative py-12 px-6 flex flex-col items-center bg-gradient-to-b from-pink-100 to-pink-50 dark:from-pink-950/40 dark:to-pink-900/10">
            <div className="relative h-48 w-48 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image 
                src="/assets/me.jpg"
                alt="My Mother" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">About My Mother</h1>
            <p className="text-lg text-muted-foreground text-center">The woman who shaped my world</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed mb-6">
                My mother is a dedicated homemaker and a hardworking woman who supports my father in running our family shop. 
                Despite her busy days, she lovingly takes care of all three of her children—I'm the middle one. 
                Her strength, resilience, and endless sacrifices inspire me every day. 
                I strive to make her proud and show that her hard work is truly paying off.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-pink-600 dark:text-pink-400">Her Strength</h3>
                  <p>
                    Balancing the demands of running a family business while being fully present for her children
                    requires extraordinary strength. She never complains about the long hours or the endless responsibilities.
                    Instead, she faces each day with determination and grace.
                  </p>
                </div>
                
                <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-pink-600 dark:text-pink-400">Her Love</h3>
                  <p>
                    Even after the most exhausting days at the shop, she always finds the energy to ask about
                    our day, help with homework, or prepare our favorite meals. Her love is evident in every
                    small gesture and sacrifice she makes for our family's wellbeing.
                  </p>
                </div>
              </div>
              
              <blockquote className="border-l-4 border-pink-600 pl-4 italic my-8">
                "A mother's love is the fuel that enables a normal human being to do the impossible." 
                <cite className="block text-sm mt-2 not-italic">— Marion C. Garretty</cite>
              </blockquote>
              
              <p className="text-lg leading-relaxed">
                Through this website, I wanted to create a tribute not just to all mothers, but especially to my own - 
                the woman who taught me resilience, kindness, and the true meaning of unconditional love. 
                Her legacy lives on in everything I do, and this project is just one small way to honor 
                her tremendous impact on my life.
              </p>
            </div>
          </div>
        </div>
        
        <div 
          className={`text-center mt-12 pt-6 border-t border-border transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="text-muted-foreground">
            Made with <Heart size={16} className="inline text-pink-600" /> for my mother | &copy;{" "}
            {new Date().getFullYear()} Mother&apos;s Day Tribute
          </p>
        </div>
      </div>
    </div>
  )
} 