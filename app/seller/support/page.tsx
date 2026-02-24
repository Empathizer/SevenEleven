"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function SellerSupportPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/support`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (e) {}
  }

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
        toast.success("Message sent to admin")
        setSubject("")
        setMessage("")
        loadMessages()
      } else {
        toast.error("Failed to send message")
      }
    } catch (e) {
      toast.error("Failed to send message")
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Contact Support</h1>
      <p className="mt-1 text-sm text-muted-foreground">Send a message to admin for help.</p>

      <div className="mt-6 max-w-2xl rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Need Help?</h2>
            <p className="text-sm text-muted-foreground">We're here to assist you</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What do you need help with?" className="mt-1" />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue or question..." rows={6} className="mt-1" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>

      {messages.length > 0 && (
        <div className="mt-6 max-w-2xl rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Message History</h2>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="border-b border-border pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground">From: {msg.userName}</p>
                  </div>
                  <Badge variant={msg.status === 'replied' ? 'default' : 'secondary'}>{msg.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
