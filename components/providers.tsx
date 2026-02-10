"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"

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
