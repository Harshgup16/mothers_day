"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useSearch } from "@/hooks/use-search"
import { useRouter, usePathname } from "next/navigation"
import { SearchAutocomplete } from "./search-autocomplete"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // Safely access search context
  let searchQuery = ""
  try {
    const searchContext = useSearch()
    searchQuery = searchContext.searchQuery
  } catch (error) {
    // Silently fail if search context is not available
    console.log("Search context not available in header")
  }

  // Close search box when navigating to a different page
  useEffect(() => {
    setIsSearchOpen(false)
  }, [pathname])

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-pink-600">
            Mother&apos;s Day Tribute
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-pink-600 transition-colors">
              Home
            </Link>
            {/* <Link href="/stories" className="text-foreground hover:text-pink-600 transition-colors">
              Stories
            </Link> */}
            <Link href="/3d" className="text-foreground hover:text-pink-600 transition-colors">
              3D
            </Link>
            <Link href="/about" className="text-foreground hover:text-pink-600 transition-colors">
              About
            </Link>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground hover:text-pink-600 transition-colors"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground hover:text-pink-600 transition-colors mr-4"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-pink-600 transition-colors ml-4"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <SearchAutocomplete
              onClose={() => setIsSearchOpen(false)}
              placeholder="Search articles, stories, topics..."
            />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 border-t border-border">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="block py-2 text-foreground hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="block py-2 text-foreground hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/3d"
                  className="block py-2 text-foreground hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  3D
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 text-foreground hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
