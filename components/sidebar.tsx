"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SearchAutocomplete } from "./search-autocomplete"
import { Mail, Loader2, Check, AlertCircle } from "lucide-react"

export default function Sidebar() {
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Capture form element immediately to ensure it's available later
    const form = e.currentTarget
    setSubscribeStatus("loading")
    
    try {
      const formData = new FormData(form)
      const email = formData.get("email") as string
      
      if (!email || !email.trim()) {
        throw new Error("Please enter your email address")
      }
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "b4941d92-8cc8-446a-b415-a5913fe17761",
          email: email,
          subject: "New Newsletter Subscription (Sidebar)",
          message: `New newsletter subscription from ${email} (submitted via sidebar)`,
          from_website: "Mother's Day Tribute",
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubscribeStatus("success")
        // Reset the form using the saved reference
        form.reset()
      } else {
        throw new Error(result.message || "Something went wrong")
      }
    } catch (error) {
      setSubscribeStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
      console.error("Newsletter subscription error:", error)
    }
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setSubscribeStatus("idle")
      setErrorMessage("")
    }, 5000)
  }

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Search Articles</h3>
        <SearchAutocomplete
          placeholder="Search by keyword..."
          maxResults={3}
        />
      </div>

      {/* Author Profile */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
            <Image src="assets/author.jpg" alt="Author" fill className="object-cover" />
          </div>
          <h3 className="text-lg font-bold mb-1">Sarah Johnson</h3>
          <p className="text-muted-foreground text-sm mb-3">Editor & Mother of Two</p>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Passionate about sharing stories that celebrate the journey of motherhood in all its forms.
          </p>
          <div className="flex space-x-2">
            <Link
              href="/about"
              className="px-4 py-2 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 transition-colors"
            >
              About Me
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 border border-pink-600 text-pink-600 text-sm rounded-md hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Highlights */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">Popular Highlights</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start space-x-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image src={`/assets/highlight-${item}.jpg`} alt={`Highlight ${item}`} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-sm line-clamp-2">
                  {item === 1
                    ? "The Unspoken Strength of Single Mothers"
                    : item === 2
                      ? "Mother's Day Around the World"
                      : "Self-Care Tips for Busy Moms"}
                </h4>
                <p className="text-muted-foreground text-xs mt-1">
                  {item === 1 ? "Stories" : item === 2 ? "Culture" : "Health"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-muted-foreground text-sm mb-4">Get the latest stories and updates delivered to your inbox.</p>

        {subscribeStatus === "success" && (
          <div className="mb-4 py-2 px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-green-700 dark:text-green-300 text-sm">Subscribed successfully!</span>
          </div>
        )}
        
        {subscribeStatus === "error" && (
          <div className="mb-4 py-2 px-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300 text-sm">{errorMessage || "Failed to subscribe"}</span>
          </div>
        )}
        
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              className="w-full p-2 pl-9 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-background text-foreground"
              disabled={subscribeStatus === "loading"}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <button
            type="submit"
            disabled={subscribeStatus === "loading"}
            className={`w-full flex items-center justify-center bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors ${
              subscribeStatus === "loading" ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {subscribeStatus === "loading" ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
