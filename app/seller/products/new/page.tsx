"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function NewProductPage() {
  const { user } = useAuth()
  const store = getStore()
  const router = useRouter()
  const categories = store.getCategories()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [image, setImage] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [stock, setStock] = useState("")
  const [featured, setFeatured] = useState(false)

  if (!user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cat = categories.find(c => c.slug === categorySlug)
    if (!cat) { toast("Please select a category"); return }

    store.addProduct({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: [image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"],
      category: cat.name,
      categorySlug: cat.slug,
      stock: Number(stock),
      sellerId: user.id,
      sellerName: user.storeName || user.name,
      featured,
    })

    toast("Product added successfully!")
    router.push("/seller/products")
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
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="29.99" required className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Original Price ($)</Label>
                <Input type="number" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="49.99" className="bg-muted" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={categorySlug} onValueChange={setCategorySlug}>
                <SelectTrigger className="bg-muted"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-card">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
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
