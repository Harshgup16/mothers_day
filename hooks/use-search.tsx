"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { searchArticles } from "@/lib/data"
import type { Article } from "@/lib/types"

interface SearchContextType {
  searchQuery: string
  searchResults: Article[]
  isSearching: boolean
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => void
  clearSearch: () => void
}

// Create a default context value for SSR or when provider is not available
const defaultContextValue: SearchContextType = {
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  setSearchQuery: () => {},
  performSearch: () => {},
  clearSearch: () => {},
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      const results = searchArticles(query)
      setSearchResults(results)
      
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query)}`)
    },
    [router]
  )

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }, [])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        setSearchQuery,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext)
  
  // If we're in a browser environment and the context is undefined, throw an error
  if (typeof window !== 'undefined' && context === undefined) {
    console.error("useSearch must be used within a SearchProvider");
    throw new Error("useSearch must be used within a SearchProvider")
  }
  
  // If we're in server-side rendering or the context is undefined, return a default context
  if (context === undefined) {
    return defaultContextValue;
  }
  
  return context
} 