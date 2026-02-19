"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Eye, EyeOff, User, Store as StoreIcon, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { getStore } from "@/lib/store" // Declared the getStore variable

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = login(email, password)
    if (result.success) {
      toast("Login successful!")
      const store = getStore()
      const loggedInUser = store.getCurrentUser()
      if (loggedInUser?.role === "admin") {
        router.push("/admin")
      } else if (loggedInUser?.role === "seller") {
        router.push("/seller")
      } else {
        router.push("/")
      }
    } else {
      setError(result.error || "Login failed")
    }
  }

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    const result = login(demoEmail, demoPassword)
    if (result.success) {
      toast("Login successful!")
      const store = getStore()
      const loggedInUser = store.getCurrentUser()
      if (loggedInUser?.role === "admin") {
        router.push("/admin")
      } else if (loggedInUser?.role === "seller") {
        router.push("/seller")
      } else {
        router.push("/")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">EsellerStore</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="bg-muted pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Sign In</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}<Link href="/register" className="font-medium text-primary hover:underline">Register</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 space-y-3">
            <p className="text-center text-xs font-semibold text-muted-foreground">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin("admin@seveneleven.com", "admin123")}
                className="flex flex-col h-auto py-3 gap-1"
              >
                <ShieldCheck className="h-5 w-5 text-chart-1" />
                <span className="text-xs font-semibold">Admin</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin("seller@seveneleven.com", "seller123")}
                className="flex flex-col h-auto py-3 gap-1"
              >
                <StoreIcon className="h-5 w-5 text-chart-3" />
                <span className="text-xs font-semibold">Seller</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin("customer@seveneleven.com", "customer123")}
                className="flex flex-col h-auto py-3 gap-1"
              >
                <User className="h-5 w-5 text-chart-4" />
                <span className="text-xs font-semibold">Customer</span>
              </Button>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>👨‍💼 Admin: admin@seveneleven.com / admin123</p>
              <p>🏪 Seller: seller@seveneleven.com / seller123</p>
              <p>🛒 Customer: customer@seveneleven.com / customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
