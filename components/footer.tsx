"use client"

import { useState } from "react"
import Link from "next/link"
import { Linkedin, Twitter, Github, Heart, Mail, Loader2, Check, AlertCircle } from "lucide-react"

export default function Footer() {
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
          subject: "New Newsletter Subscription",
          message: `New newsletter subscription from ${email}`,
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
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mother&apos;s Day Tribute</h3>
            <p className="text-muted-foreground mb-4">
              Celebrating the incredible journey of motherhood and the amazing women who shape our lives.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/harshgup16" className="text-muted-foreground hover:text-pink-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://x.com/harshgup16" className="text-muted-foreground hover:text-pink-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com/Harshgup16" className="text-muted-foreground hover:text-pink-600 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/3d" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  3D
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?category=Stories" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/?category=Health" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/?category=Inspiration" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Inspiration
                </Link>
              </li>
              <li>
                <Link href="/?category=Parenting" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Parenting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-4">Get the latest stories and updates delivered to your inbox.</p>
            
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

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground">
            Made with <Heart size={16} className="inline text-pink-600" /> for all mothers | &copy;{" "}
            {new Date().getFullYear()} Mother&apos;s Day Tribute
          </p>
        </div>
      </div>
    </footer>
  )
}
