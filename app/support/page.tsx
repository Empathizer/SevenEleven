"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function CustomerSupportPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subject, message })
      })

      if (res.ok) {
        toast.success("Message sent successfully")
        setSubject("")
        setMessage("")
      } else {
        toast.error("Failed to send message")
      }
    } catch (e) {
      toast.error("Failed to send message")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">Customer Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">We're here to help you with any questions or concerns.</p>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Get in Touch</h2>
                <p className="text-sm text-muted-foreground">Send us a message and we'll respond shortly</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What can we help you with?" className="mt-1" />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more about your inquiry..." rows={6} className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
