import Image from "next/image"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-lg">
          Have questions, suggestions, or want to share your own mother's day story? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="order-2 md:order-1">
          <ContactForm />
        </div>
        
        <div className="order-1 md:order-2">
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 h-full space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Contact Information</h3>
              <p className="text-muted-foreground">
                Feel free to reach out to us through the form or using the contact information below.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-muted-foreground">harsh.23bai11306@vitbhopal.ac.in</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Social Media</h4>
                <p className="text-muted-foreground">Follow us on Instagram, Twitter, and Facebook</p>
              </div>
              
              
            </div>
            
            <div className="relative h-48 w-full overflow-hidden rounded-md mt-4">
              <Image 
                src="/images/contact-illustration.jpg" 
                alt="Mother and child illustration" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
