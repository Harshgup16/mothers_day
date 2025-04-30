import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  category: string
  readingTime: number
  date: string
}

export default function ArticleCard({ id, title, excerpt, imageUrl, category, readingTime, date }: ArticleCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image src={imageUrl || "/images/default-mother.jpg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium px-2 py-1 bg-pink-100 dark:bg-pink-950/50 text-pink-600 rounded-full">{category}</span>
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock size={14} className="mr-1" />
            <span>{readingTime} min read</span>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">{excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{date}</span>
          <Link
            href={`/articles/${id}`}
            className="text-pink-600 font-medium text-sm hover:text-pink-700 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  )
}
