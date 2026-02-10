"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function SellerStorePage() {
  const { user } = useAuth()
  const store = getStore()

  const [storeName, setStoreName] = useState(user?.storeName || "")
  const [storeDescription, setStoreDescription] = useState(user?.storeDescription || "")
  const [name, setName] = useState(user?.name || "")

  if (!user) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    store.updateUser(user.id, { name, storeName, storeDescription })
    toast("Store profile updated!")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Store Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your store information.</p>

      <form onSubmit={handleSave} className="mt-6 max-w-2xl">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Your Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-muted" />
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
                <Input value={user.email} disabled className="bg-muted opacity-60" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Save Changes</Button>
      </form>
    </div>
  )
}
