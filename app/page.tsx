"use client"

import type React from "react"

import { useState } from "react"
import HeroCarousel from "@/components/hero-carousel"
import CategoryCard from "@/components/category-card"
import ArticleCard from "@/components/article-card"
import Sidebar from "@/components/sidebar"
import { getArticles, getCategories, getFeaturedArticles, getArticlesByCategory } from "@/lib/data"
import type { Article } from "@/lib/types"
import { useSearch } from "@/hooks/use-search"
import { SearchAutocomplete } from "@/components/search-autocomplete"

export default function Home() {
  const featuredArticles = getFeaturedArticles()
  const categories = getCategories()
  const allArticles = getArticles()

  const [filteredArticles, setFilteredArticles] = useState<Article[]>(allArticles)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      setActiveCategory(category.title)
      setFilteredArticles(getArticlesByCategory(category.title))
    }
  }

  const handleLocalSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // This is preserved for potential local filtering in the future
  }

  const clearFilters = () => {
    setFilteredArticles(allArticles)
    setActiveCategory(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <HeroCarousel featuredArticles={featuredArticles} />
      </section>

      {/* Search Bar (Mobile) */}
      <div className="mb-8 md:hidden">
        <SearchAutocomplete placeholder="Search articles..." />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column (Articles) */}
        <div className="md:w-2/3">
          {/* Categories Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Explore by Category</h2>
              {activeCategory && (
                <button onClick={clearFilters} className="text-pink-600 text-sm hover:underline">
                  Clear Filter
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  imageUrl={category.imageUrl}
                  count={category.count}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
          </section>

          {/* Recent Articles Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {activeCategory ? `${activeCategory} Articles` : "Recent Articles"}
              </h2>
              {filteredArticles.length > 0 && (
                <span className="text-muted-foreground text-sm">
                  {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
                </span>
              )}
            </div>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    readingTime={article.readingTime}
                    date={article.date}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg">
                <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  View All Articles
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="md:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
