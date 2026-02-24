"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [sellers, setSellers] = useState<any[]>([])
  const [selectedSeller, setSelectedSeller] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    loadMessages()
    loadSellers()
  }, [])

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/messages`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (e) {}
  }

  const loadSellers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setSellers(data.data || [])
      }
    } catch (e) {}
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeller || !subject || !message) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sellerId: selectedSeller, subject, message })
      })

      if (res.ok) {
        toast.success("Message sent to seller")
        setSelectedSeller("")
        setSubject("")
        setMessage("")
        setDialogOpen(false)
        loadMessages()
      } else {
        toast.error("Failed to send message")
      }
    } catch (e) {
      toast.error("Failed to send message")
    }
    setLoading(false)
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText) {
      toast.error("Please enter a reply")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/messages/${selectedMessage._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reply: replyText })
      })

      if (res.ok) {
        toast.success("Reply sent")
        setReplyText("")
        setReplyDialogOpen(false)
        loadMessages()
      } else {
        toast.error("Failed to send reply")
      }
    } catch (e) {
      toast.error("Failed to send reply")
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">View support messages and send messages to sellers.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Send className="h-4 w-4 mr-2" /> Send Message to Seller
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>From</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg._id}>
                <TableCell className="font-medium">{msg.userName}</TableCell>
                <TableCell><Badge variant="secondary">{msg.userRole}</Badge></TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell className="max-w-xs truncate">{msg.message}</TableCell>
                <TableCell><Badge>{msg.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {msg.userRole !== 'admin' && (
                    <Button size="sm" onClick={() => { setSelectedMessage(msg); setReplyDialogOpen(true); }}>
                      Reply
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No messages</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Seller</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <Label>Select Seller</Label>
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a seller" />
                </SelectTrigger>
                <SelectContent>
                  {sellers.map((seller) => (
                    <SelectItem key={seller._id} value={seller.userId?._id || seller.userId}>
                      {seller.storeName || seller.userId?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Message subject" className="mt-1" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." rows={5} className="mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.userName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Original Message</Label>
              <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                <p className="font-semibold">{selectedMessage?.subject}</p>
                <p className="mt-1 text-muted-foreground">{selectedMessage?.message}</p>
              </div>
            </div>
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <Label>Your Reply</Label>
                <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." rows={5} className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Reply"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
