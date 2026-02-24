"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function SupportChat({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [userId])

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setMessages(data.messages || [])
          setUnreadCount(data.messages?.filter((m: any) => !m.read).length || 0)
        }
      }
    } catch (e) {}
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      const res = await fetch(`${API_URL}/api/admin/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ receiverId: 'admin', message: newMessage })
      })
      if (res.ok) {
        setNewMessage("")
        toast.success("Message sent to admin")
        loadMessages()
      }
    } catch (e) {}
  }

  const handleOpen = async () => {
    setOpen(true)
    // Mark as read
    for (const msg of messages.filter(m => !m.read)) {
      await fetch(`${API_URL}/api/messages/${msg._id}/read`, {
        method: 'PUT',
        credentials: 'include'
      })
    }
    setUnreadCount(0)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
            {unreadCount}
          </Badge>
        )}
      </button>

      {/* Chat Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Support Chat</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.senderId._id === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.senderId._id === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm font-semibold mb-1">{msg.senderId.name}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
