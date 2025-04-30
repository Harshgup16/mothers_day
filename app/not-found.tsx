import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Home
      </Link>
    </div>
  )
}
