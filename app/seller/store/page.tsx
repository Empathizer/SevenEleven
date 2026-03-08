"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function SellerStorePage() {
  const { user } = useAuth()
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [name, setName] = useState("")
  const [seller, setSeller] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/seller/profile`, { credentials: "include" })
        .then(r => r.json())
        .then(data => {
          setSeller(data.data)
          setStoreName(data.data?.storeName || "")
          setStoreDescription(data.data?.storeDescription || "")
          setName(user.name || "")
        })
    }
  }, [user])

  if (!user) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/seller/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ storeName, storeDescription })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Store profile updated!")
      } else {
        toast.error(data.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Store Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your store information.</p>
        </div>
        {seller?.status === 'approved' ? (
          <Badge className="bg-chart-4 text-primary-foreground">
            <ShieldCheck className="mr-1 h-3 w-3" /> Verified
          </Badge>
        ) : (
          <Badge variant="destructive">
            <ShieldAlert className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )}
      </div>

      {seller?.status !== 'approved' && (
        <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm text-destructive font-semibold">⚠️ Account Not Verified</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your seller account is pending admin approval. You will receive an email notification once verified.
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 max-w-2xl">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Your Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-muted" disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Store Name</Label>
                <Input value={storeName} onChange={e => setStoreName(e.target.value)} className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Store Description</Label>
                <Textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)} className="bg-muted" rows={4} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Input value={user.email} disabled className="bg-muted opacity-60" />
                  {seller?.status === 'approved' ? (
                    <Badge className="bg-chart-4 text-primary-foreground shrink-0">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="shrink-0">
                      <ShieldAlert className="mr-1 h-3 w-3" /> Unverified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Save Changes</Button>
      </form>
    </div>
  )
}
