"use client"

import { useState, useEffect, useRef } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageCircle } from "lucide-react"

export default function AdminChatsPage() {
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchChats()
    const interval = setInterval(fetchChats, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat/admin")
      const data = await res.json()
      if (data.success) {
        setChats(data.chats)
        if (selectedChat) {
          const updated = data.chats.find((c: any) => c._id === selectedChat._id)
          if (updated) setSelectedChat(updated)
        }
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    }
  }

  const handleSendReply = async () => {
    if (!message.trim() || !selectedChat) return

    try {
      const res = await fetch("/api/chat/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: selectedChat._id, message })
      })
      const data = await res.json()
      if (data.success) {
        setSelectedChat({ ...selectedChat, messages: data.messages })
        setMessage("")
        fetchChats()
      }
    } catch (error) {
      console.error("Failed to send reply:", error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat?.messages])

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-4">
        <Card className="w-80 p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">Chats</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedChat?._id === chat._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{chat.guestName}</p>
                    <p className="text-xs truncate opacity-80">{chat.guestEmail}</p>
                  </div>
                </div>
                <p className="text-xs mt-1 opacity-70">
                  {chat.messages.length} messages
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedChat.guestName}</h3>
                <p className="text-sm text-muted-foreground">{selectedChat.guestEmail}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat.messages.map((msg: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.sender === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your reply..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
                  />
                  <Button onClick={handleSendReply} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a chat to view messages
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
