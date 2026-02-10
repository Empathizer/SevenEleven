"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import type { UserRole } from "@/lib/store"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("customer")
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = register({ name, email, password, role, storeName: role === "seller" ? storeName : undefined, storeDescription: role === "seller" ? storeDescription : undefined })
    if (result.success) {
      if (role === "seller") {
        toast("Registration submitted! Awaiting admin approval.")
        router.push("/login")
      } else {
        toast("Account created!")
        router.push("/")
      }
    } else {
      setError(result.error || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">SevenEleven</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Create your account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Account Type</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "seller" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="My Store" required className="bg-muted" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeDesc">Store Description</Label>
                  <Textarea id="storeDesc" value={storeDescription} onChange={e => setStoreDescription(e.target.value)} placeholder="Tell us about your store" className="bg-muted" rows={3} />
                </div>
                <p className="rounded-lg bg-chart-3/10 p-3 text-xs text-chart-3">Seller accounts require admin approval before you can start selling.</p>
              </>
            )}

            <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              {role === "seller" ? "Submit for Approval" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
