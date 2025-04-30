import Image from "next/image"
import Link from "next/link"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  // This would normally fetch data based on the slug
  const article = {
    title: "When Is The Best Time of Year To Visit Japan?",
    content: `
      <p>Japan is a country of four distinct seasons, each with its own character and charm. The best time to visit Japan depends on what you want to see and do.</p>
      <p>Spring (March to May) is perhaps the most popular time to visit Japan, when the cherry blossoms are in bloom. The cherry blossom season typically begins in late March in Tokyo and moves northward, reaching Hokkaido by early May.</p>
      <p>Summer (June to August) can be hot and humid, but it's a great time for hiking in the mountains and attending traditional festivals. The rainy season typically runs from early June to mid-July, except in Hokkaido.</p>
      <p>Autumn (September to November) is another popular time to visit, when the leaves change color. The autumn colors typically begin in the north and in the mountains in September and move southward, reaching Tokyo by late November.</p>
      <p>Winter (December to February) can be cold, especially in the north, but it's a great time for winter sports and for seeing snow-covered landscapes. Many parts of Japan receive heavy snowfall, particularly along the Sea of Japan coast.</p>
    `,
    author: "Jessica Brennan",
    date: "April 15, 2023",
    category: "Japan",
    relatedArticles: [
      {
        title: "Japanese Seasons and The Basics",
        slug: "japanese-seasons",
      },
      {
        title: "Spring in Japan",
        slug: "spring-in-japan",
      },
      {
        title: "Fall in Japan",
        slug: "fall-in-japan",
      },
      {
        title: "Winter in Japan",
        slug: "winter-in-japan",
      },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <article>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="block w-6 h-1 bg-black" />
            ))}
          </div>
          <div className="text-sm text-[#949799]">
            By {article.author} • {article.date}
          </div>
        </div>

        <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-video bg-[#dce4e7]">
            <Image src="/placeholder.svg?height=400&width=600" alt="Japan in Spring" fill className="object-cover" />
          </div>
          <div className="relative aspect-video bg-[#dce4e7]">
            <Image src="/placeholder.svg?height=400&width=600" alt="Japan in Autumn" fill className="object-cover" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {article.relatedArticles.map((related, index) => (
            <Link key={index} href={`/article/${related.slug}`} className="group">
              <div className="relative aspect-video bg-[#dce4e7] mb-4">
                <Image src="/placeholder.svg?height=300&width=500" alt={related.title} fill className="object-cover" />
              </div>
              <h3 className="font-medium group-hover:underline">{related.title}</h3>
            </Link>
          ))}
        </div>
      </article>
    </div>
  )
}
