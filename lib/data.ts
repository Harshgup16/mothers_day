import articlesData from "@/data/articles.json"
import categoriesData from "@/data/categories.json"
import type { Article, Category, SearchResult } from "./types"

export function getArticles(): Article[] {
  return articlesData
}

export function getFeaturedArticles(): Article[] {
  return articlesData.filter((article) => article.featured)
}

export function getArticleById(id: string): Article | undefined {
  return articlesData.find((article) => article.id === id)
}

export function getArticlesByCategory(category: string): Article[] {
  return articlesData.filter((article) => article.category.toLowerCase() === category.toLowerCase())
}

export function getCategories(): Category[] {
  return categoriesData
}

export function getCategoryById(id: string): Category | undefined {
  return categoriesData.find((category) => category.id === id)
}

// Define weights for different content fields
const TITLE_WEIGHT = 3
const EXCERPT_WEIGHT = 2
const CONTENT_WEIGHT = 1
const CATEGORY_WEIGHT = 2

export function searchArticles(query: string): Article[] {
  const searchTerm = query.toLowerCase().trim()
  
  if (!searchTerm) return []
  
  // Split the search term into words
  const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 2)
  
  // Add the original search term as well if it's a phrase
  if (searchTerm.includes(' ') && searchTerm.length > 3) {
    searchTerms.push(searchTerm)
  }
  
  // Calculate relevance score for each article
  const scoredArticles = articlesData.map((article) => {
    // Initialize score
    let score = 0
    
    const titleLower = article.title.toLowerCase()
    const excerptLower = article.excerpt.toLowerCase()
    const contentLower = article.content.toLowerCase()
    const categoryLower = article.category.toLowerCase()
    
    // Process each search term
    for (const term of searchTerms) {
      // Exact matches in title are highly valuable
      if (titleLower === term) {
        score += TITLE_WEIGHT * 5
      } else if (titleLower.includes(term)) {
        score += TITLE_WEIGHT * (1 + (term.length / titleLower.length))
      }
      
      // Matches in excerpt
      if (excerptLower.includes(term)) {
        score += EXCERPT_WEIGHT * (1 + (term.length / excerptLower.length))
      }
      
      // Matches in content
      if (contentLower.includes(term)) {
        score += CONTENT_WEIGHT
        
        // Give bonus points for multiple occurrences
        const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length
        if (occurrences > 1) {
          score += CONTENT_WEIGHT * Math.min(occurrences / 5, 1) // Cap at doubling the score
        }
      }
      
      // Category matches
      if (categoryLower === term || categoryLower.includes(term)) {
        score += CATEGORY_WEIGHT
      }
    }
    
    return { article, score }
  })
  
  // Filter articles with a score > 0 and sort by score (descending)
  return scoredArticles
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.article)
}

// Function to get search results with highlighted snippets
export function getSearchResultsWithHighlights(query: string): SearchResult[] {
  const searchTerm = query.toLowerCase().trim()
  
  if (!searchTerm) return []
  
  const articles = searchArticles(query)
  
  return articles.map(article => {
    // Prepare snippet from content
    const contentText = stripHtmlTags(article.content)
    const snippets = extractSnippetsWithQuery(contentText, searchTerm, 2)
    
    return {
      ...article,
      snippets
    }
  })
}

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Helper function to extract relevant snippets containing the search term
function extractSnippetsWithQuery(text: string, query: string, maxSnippets: number): string[] {
  const searchTerms = query.split(/\s+/).filter(term => term.length > 2)
  const snippets: string[] = []
  
  // Try to find snippets for each search term
  for (const term of searchTerms) {
    if (snippets.length >= maxSnippets) break
    
    const index = text.toLowerCase().indexOf(term)
    if (index !== -1) {
      // Get surrounding context (about 100 chars before and after)
      const start = Math.max(0, index - 100)
      const end = Math.min(text.length, index + term.length + 100)
      
      let snippet = text.substring(start, end)
      
      // Add ellipsis if we're not at the beginning/end
      if (start > 0) snippet = '...' + snippet
      if (end < text.length) snippet = snippet + '...'
      
      // Avoid duplicate snippets
      if (!snippets.some(s => s.includes(snippet) || snippet.includes(s))) {
        snippets.push(snippet)
      }
    }
  }
  
  // If we didn't find specific snippets, just return the beginning of the text
  if (snippets.length === 0 && text.length > 0) {
    snippets.push(text.substring(0, 200) + '...')
  }
  
  return snippets
}
