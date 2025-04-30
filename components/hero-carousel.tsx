"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Article } from "@/lib/types"

interface HeroCarouselProps {
  featuredArticles: Article[]
}

export default function HeroCarousel({ featuredArticles }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredArticles.length) % featuredArticles.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!featuredArticles.length) return null

  const article = featuredArticles[currentIndex]

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={article.imageUrl || "/images/default-mother.jpg"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
        <div className="inline-block px-3 py-1 mb-4 bg-pink-600 text-white text-sm rounded-full">
          {article.category}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">{article.title}</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl opacity-90">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              By <span className="font-medium">{article.author}</span> | {article.date} | {article.readingTime} min read
            </div>
          </div>
          <Link
            href={`/articles/${article.id}`}
            className="px-6 py-2 bg-white text-pink-600 font-medium rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/30 backdrop-blur-sm text-white rounded-full hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/30 backdrop-blur-sm text-white rounded-full hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            } transition-colors`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
