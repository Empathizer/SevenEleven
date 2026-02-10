"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function SellerRegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = register({ name, email, password, role: "seller", storeName, storeDescription })
    if (result.success) {
      toast("Application submitted! Awaiting admin approval.")
      router.push("/login")
    } else {
      setError(result.error || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">SevenEleven</span>
            </Link>
            <div className="mt-3 flex items-center gap-2 text-muted-foreground">
              <Store className="h-4 w-4" />
              <span className="text-sm">Start selling on SevenEleven</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="bg-muted" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Store Name</Label>
              <Input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Your store name" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Store Description</Label>
              <Textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)} placeholder="What does your store sell?" className="bg-muted" rows={3} />
            </div>

            <div className="rounded-lg bg-primary/5 p-4 text-xs text-muted-foreground">
              By registering as a seller, you agree to our seller policies. Your account will be reviewed by our admin team before approval.
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Submit Application</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have a seller account? <Link href="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
