"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getSearchResultsWithHighlights } from "@/lib/data"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { SearchResult } from "@/lib/types"
import { useSearch } from "@/hooks/use-search"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const { setSearchQuery } = useSearch()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Use effect to ensure this only runs on the client side
    if (queryParam) {
      try {
        setSearchQuery(queryParam)
      } catch (error) {
        console.error("Error setting search query:", error);
      }
      
      setIsLoading(true)
      
      // Get search results with snippets
      const results = getSearchResultsWithHighlights(queryParam)
      setSearchResults(results)
      setIsLoading(false)
    }
  }, [queryParam, setSearchQuery])

  // Function to highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2)
    let result = text
    
    // Replace each search term with a highlighted version
    for (const term of searchTerms) {
      const regex = new RegExp(`(${term})`, 'gi')
      result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-amber-700/70 px-1 rounded">$1</mark>')
    }
    
    return result
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          {isLoading
            ? "Searching..."
            : searchResults.length > 0
              ? `Found ${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for "${queryParam}"`
              : `No results found for "${queryParam}"`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted rounded-lg h-40"></div>
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-8">
          {searchResults.map((result) => (
            <div key={result.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/4 relative h-48 md:h-auto">
                  <Link href={`/articles/${result.id}`}>
                    <img 
                      src={result.imageUrl || "/images/default-mother.jpg"} 
                      alt={result.title} 
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-pink-100 dark:bg-pink-950/50 text-pink-600 rounded-full">
                      {result.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{result.date}</span>
                  </div>
                  <Link href={`/articles/${result.id}`}>
                    <h2 className="text-xl font-bold mb-2 hover:text-pink-600 transition-colors"
                        dangerouslySetInnerHTML={{ __html: highlightText(result.title, queryParam) }}
                    ></h2>
                  </Link>
                  <p className="text-muted-foreground mb-4 text-sm"
                     dangerouslySetInnerHTML={{ __html: highlightText(result.excerpt, queryParam) }}
                  ></p>
                  
                  {/* Snippets with highlighted matches */}
                  {result.snippets.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                      <h3 className="text-sm font-medium mb-2">Matching content:</h3>
                      <div className="space-y-2">
                        {result.snippets.map((snippet, idx) => (
                          <p key={idx} 
                             className="text-xs text-muted-foreground bg-muted/50 p-2 rounded"
                             dangerouslySetInnerHTML={{ __html: highlightText(snippet, queryParam) }}
                          ></p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Link
                      href={`/articles/${result.id}`}
                      className="text-pink-600 font-medium text-sm hover:text-pink-700 transition-colors"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg">
          <p className="text-muted-foreground mb-4">No articles found matching your search criteria.</p>
          <div className="space-y-3">
            <p className="text-foreground">Try:</p>
            <ul className="text-muted-foreground list-disc list-inside">
              <li>Checking your spelling</li>
              <li>Using fewer or different keywords</li>
              <li>Searching for a related topic</li>
            </ul>
            <Link 
              href="/"
              className="mt-6 inline-block px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 