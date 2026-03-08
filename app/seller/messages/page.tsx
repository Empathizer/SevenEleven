"use client"

import { useState, useEffect } from "react"
import { Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function SellerMessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConv, setSelectedConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) loadConversations()
  }, [user])

  const loadConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (e) {}
  }

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/${convId}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (e) {}
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return
    
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: selectedConv.otherUser._id,
          message: newMessage
        })
      })
      
      if (res.ok) {
        setNewMessage("")
        loadMessages(selectedConv._id)
        loadConversations()
      } else {
        toast.error("Failed to send message")
      }
    } catch (e) {
      toast.error("Failed to send message")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv._id)
      const interval = setInterval(() => loadMessages(selectedConv._id), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedConv])

  if (!user) return null

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Customer Messages</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold text-foreground mb-3">Conversations</h2>
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          ) : (
            <div className="space-y-2">
              {conversations.map(conv => (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConv(conv)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedConv?._id === conv._id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">{conv.otherUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card flex flex-col h-[600px]">
          {selectedConv ? (
            <>
              <div className="border-b border-border p-4">
                <h3 className="font-semibold text-foreground">{selectedConv.otherUser.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedConv.otherUser.email}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.senderId === user._id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={2}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Select a conversation to reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
