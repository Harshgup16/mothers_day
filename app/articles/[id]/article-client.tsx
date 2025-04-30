"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react"
import { getArticleById, getArticlesByCategory } from "@/lib/data"
import type { Article } from "@/lib/types"
import Sidebar from "@/components/sidebar"
import ArticleCard from "@/components/article-card"

interface ArticleClientProps {
  articleId: string
}

export default function ArticleClient({ articleId }: ArticleClientProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = () => {
      const foundArticle = getArticleById(articleId)

      if (foundArticle) {
        setArticle(foundArticle)

        // Get related articles from the same category
        const related = getArticlesByCategory(foundArticle.category)
          .filter((a) => a.id !== foundArticle.id)
          .slice(0, 2)

        setRelatedArticles(related)
      }

      setIsLoading(false)
    }

    fetchArticle()
  }, [articleId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-12"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-2/3">
          <Link href="/" className="inline-flex items-center text-pink-600 hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <article>
            {/* Article Header */}
            <header className="mb-8">
              <div className="inline-block px-3 py-1 mb-4 bg-pink-100 text-pink-600 text-sm rounded-full">
                {article.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
              <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{article.readingTime} min read</span>
                </div>
                <div className="flex items-center">
                  <span>By {article.author}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.imageUrl || "/images/default-mother.jpg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Article Footer */}
            <footer className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 text-sm">Category:</span>
                  <Link href={`/?category=${article.category}`} className="ml-2 text-pink-600 hover:underline">
                    {article.category}
                  </Link>
                </div>
                <Link href="/" className="text-pink-600 hover:underline">
                  Back to Home
                </Link>
              </div>
            </footer>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((related) => (
                  <ArticleCard
                    key={related.id}
                    id={related.id}
                    title={related.title}
                    excerpt={related.excerpt}
                    imageUrl={related.imageUrl}
                    category={related.category}
                    readingTime={related.readingTime}
                    date={related.date}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  )
} 