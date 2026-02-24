"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getStore } from "@/lib/store"
import { MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"

export default function CustomerSupportPage() {
  const store = getStore()
  const [chats, setChats] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [, setRefresh] = useState(0)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = () => {
    const customerChats = store.getCustomerChats()
    setChats(customerChats)
  }

  const loadMessages = (userId: string) => {
    setSelectedUserId(userId)
    const msgs = store.getMessages(userId)
    setMessages(msgs)
    // Mark admin messages as read
    msgs.filter(m => m.receiverId === 'user-admin' && !m.read).forEach(m => store.markAsRead(m.id))
    setRefresh(v => v + 1)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) return
    store.sendMessage('user-admin', selectedUserId, newMessage)
    setNewMessage("")
    loadMessages(selectedUserId)
    loadChats()
    toast.success("Message sent")
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Customer Support</h1>
      
      <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
        {/* Chat List */}
        <div className="border rounded-lg p-4 overflow-auto">
          <h2 className="font-semibold mb-4">Customers</h2>
          {chats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.userId}
                  onClick={() => loadMessages(chat.userId)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-muted ${selectedUserId === chat.userId ? 'bg-muted' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{chat.userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge variant="destructive" className="ml-2">{chat.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="col-span-2 border rounded-lg flex flex-col">
          {selectedUserId ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{chats.find(c => c.userId === selectedUserId)?.userName}</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === 'user-admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderId === 'user-admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a customer to view conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
