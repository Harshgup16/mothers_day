"use client"

import Image from "next/image"

interface CategoryCardProps {
  title: string
  description: string
  imageUrl: string
  count: number
  onClick: () => void
}

export default function CategoryCard({ title, description, imageUrl, count, onClick }: CategoryCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-40">
        <Image
          src={imageUrl || "/images/default-mother.jpg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90 mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-pink-600 px-2 py-1 rounded-full">{count} articles</span>
          <span className="text-sm underline">Explore</span>
        </div>
      </div>
    </div>
  )
}
