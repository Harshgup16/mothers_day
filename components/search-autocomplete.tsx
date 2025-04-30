"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { searchArticles } from "@/lib/data"
import { useSearch } from "@/hooks/use-search"
import { useDebounce } from "@/hooks/use-debounce"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { useRouter } from "next/navigation"

interface SearchAutocompleteProps {
  onClose?: () => void
  placeholder?: string
  className?: string
  maxResults?: number
}

export function SearchAutocomplete({
  onClose,
  placeholder = "Search articles...",
  className = "",
  maxResults = 5
}: SearchAutocompleteProps) {
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Article[]>([])
  const debouncedSearchTerm = useDebounce(inputValue, 300)
  const router = useRouter()
  
  // Safely use the search context with a fallback
  let searchContext
  try {
    searchContext = useSearch()
  } catch (error) {
    // Provide a fallback if context is not available
    searchContext = {
      performSearch: (query: string) => {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }
  
  const { performSearch } = searchContext
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update suggestions when the search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      const results = searchArticles(debouncedSearchTerm).slice(0, maxResults)
      setSuggestions(results)
      setIsOpen(results.length > 0)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [debouncedSearchTerm, maxResults])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      performSearch(inputValue)
      setIsOpen(false)
      if (onClose) onClose()
    }
  }

  const handleItemClick = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleClearInput = () => {
    setInputValue("")
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleFormSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full p-2 pl-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-background text-foreground"
            aria-label="Search"
            onFocus={() => inputValue && suggestions.length > 0 && setIsOpen(true)}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-card shadow-lg rounded-md border border-border overflow-hidden"
        >
          <ul className="py-1">
            {suggestions.map((article) => (
              <li key={article.id} className="px-4 py-2 hover:bg-muted">
                <Link 
                  href={`/articles/${article.id}`} 
                  className="block"
                  onClick={handleItemClick}
                >
                  <div className="flex items-start">
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        src={article.imageUrl || "/images/default-mother.jpg"} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium line-clamp-1">{article.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {article.category} • {article.readingTime} min read
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            <li className="border-t border-border">
              <button
                type="button" 
                className="w-full text-left px-4 py-2 text-pink-600 text-sm hover:bg-muted"
                onClick={() => {
                  performSearch(inputValue)
                  setIsOpen(false)
                  if (onClose) onClose()
                }}
              >
                View all results for "{inputValue}"
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
} 