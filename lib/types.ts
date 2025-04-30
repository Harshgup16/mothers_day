export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  readingTime: number
  imageUrl: string
  featured?: boolean
}

export interface Category {
  id: string
  title: string
  description: string
  imageUrl: string
  count: number
}

export interface SearchResult extends Article {
  snippets: string[]
}
