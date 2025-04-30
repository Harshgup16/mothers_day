import Link from "next/link"
import Image from "next/image"

export default function CategoriesPage() {
  const categories = [
    {
      name: "Japan",
      count: 12,
      featured: [
        {
          title: "Exploring City Guide: Kyoto's Greatest Shrines",
          slug: "kyoto-shrines-guide",
        },
        {
          title: "When Is The Best Time of Year To Visit Japan?",
          slug: "best-time-to-visit-japan",
        },
        {
          title: "Japanese Seasons and The Basics",
          slug: "japanese-seasons",
        },
      ],
    },
    {
      name: "Travel Tips",
      count: 8,
      featured: [
        {
          title: "Planning a Trip to Japan in the Time of Covid",
          slug: "japan-covid-travel",
        },
        {
          title: "How to Choose an African Safari (And Fight for Your Spot)",
          slug: "african-safari-guide",
        },
      ],
    },
    {
      name: "Africa",
      count: 5,
      featured: [
        {
          title: "How to Choose an African Safari (And Fight for Your Spot)",
          slug: "african-safari-guide",
        },
      ],
    },
    {
      name: "Europe",
      count: 7,
      featured: [
        {
          title: "Exploring City Guide: Paris's Greatest Museums",
          slug: "paris-museums-guide",
        },
      ],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold mb-12">Categories</h1>

      {categories.map((category, index) => (
        <section key={index} className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">{category.name}</h2>
            <span className="text-sm text-[#949799]">{category.count} posts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {category.featured.map((article, i) => (
              <Link key={i} href={`/article/${article.slug}`} className="group">
                <div className="relative aspect-square bg-[#dce4e7] mb-4">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium group-hover:underline">{article.title}</h3>
                <div className="mt-2">
                  <span className="bg-black text-white text-xs px-2 py-1">Read</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
