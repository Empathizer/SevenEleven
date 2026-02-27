"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [chatId, setChatId] = useState("")
  const [showForm, setShowForm] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollInterval = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatId && isOpen) {
      pollInterval.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/chat/guest?chatId=${chatId}`)
          const data = await res.json()
          if (data.success) {
            setMessages(data.messages)
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error)
        }
      }, 3000)
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current)
    }
  }, [chatId, isOpen])

  const handleStartChat = () => {
    if (name && email) {
      setShowForm(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    try {
      const res = await fetch("/api/chat/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: input, chatId })
      })
      const data = await res.json()
      if (data.success) {
        setChatId(data.chatId)
        setMessages(data.messages)
        setInput("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-lg shadow-xl flex flex-col z-50">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Chat with us</h3>
              <p className="text-xs opacity-90">We typically reply instantly</p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {showForm ? (
            <div className="flex-1 p-6 flex flex-col justify-center gap-4">
              <div>
                <h4 className="font-semibold mb-2">Start a conversation</h4>
                <p className="text-sm text-muted-foreground mb-4">Please provide your details to continue</p>
              </div>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleStartChat} disabled={!name || !email}>
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        msg.sender === "guest"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
