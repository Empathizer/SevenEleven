"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [buyingPrice, setBuyingPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [image, setImage] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [stock, setStock] = useState("")
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    fetch("/api/products/categories")
      .then(r => r.json())
      .then(data => setCategories(data.data || []))
  }, [])

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) { toast("Please select a category"); return }

    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        buyingPrice: Number(buyingPrice),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        images: [image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"],
        categoryId,
        stock: Number(stock),
        featured,
      })
    })

    if (res.ok) {
      toast("Product added successfully!")
      router.push("/seller/products")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">List a new product in your store.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Product Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product" required className="bg-muted" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Buying Price ($)</Label>
                <Input type="number" step="0.01" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} placeholder="20.00" required className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Selling Price ($)</Label>
                <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="29.99" required className="bg-muted" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Original Price ($) - Optional</Label>
              <Input type="number" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="49.99" className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-muted"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-card">
                  {categories.map(cat => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Image URL</Label>
              <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Stock Quantity</Label>
              <Input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="100" required className="bg-muted" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={featured} onCheckedChange={setFeatured} />
              <Label>Featured Product</Label>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Add Product</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push("/seller/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
