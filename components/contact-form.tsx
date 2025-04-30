"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2 } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    
    try {
      // Form validation
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill out all required fields")
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }
      
      // Web3Forms API integration
      const apiEndpoint = "https://api.web3forms.com/submit"
      
      const formSubmission = {
        access_key: "b4941d92-8cc8-446a-b415-a5913fe17761",
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "New contact message from Mother's Day Tribute",
        message: formData.message,
        from_name: "Mother's Day Tribute Contact Form"
      }
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(formSubmission)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Reset form and show success message
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        })
        setIsSubmitted(true)
      } else {
        throw new Error("Something went wrong. Please try again.")
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      {isSubmitted ? (
        <div className="text-center py-12">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-6">
            Your message has been sent successfully. We'll get back to you soon.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)} 
            variant="outline"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={5}
              required
              className="min-h-[150px]"
            />
          </div>
          
          {errorMessage && (
            <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By submitting this form, you agree to our privacy policy and terms of service.
          </p>
        </form>
      )}
    </div>
  )
} 