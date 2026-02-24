"use client"

import type { ReactNode } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import { SupportChat } from "@/components/support-chat"

function SupportChatWrapper() {
  const { user } = useAuth()
  
  if (!user || user.role === 'admin') return null
  
  return <SupportChat userId={user.id} />
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  )
}
