"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminAddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [sellers, setSellers] = useState<any[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [buyingPrice, setBuyingPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sellerId, setSellerId] = useState("")
  const [stock, setStock] = useState("")
  const [images, setImages] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/admin/categories`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
    
    fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setSellers(data.data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          buyingPrice: parseFloat(buyingPrice),
          categoryId,
          sellerId,
          stock: parseInt(stock),
          images: images.split(',').map(img => img.trim())
        })
      })

      if (res.ok) {
        toast.success("Product added successfully")
        router.push("/admin/products")
      } else {
        toast.error("Failed to add product")
      }
    } catch (e) {
      toast.error("Failed to add product")
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Add Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add a new product to the platform.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
        <div>
          <Label>Product Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Selling Price</Label>
            <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label>Buying Price</Label>
            <Input type="number" step="0.01" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} required className="mt-1" />
          </div>
        </div>

        <div>
          <Label>Stock</Label>
          <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Seller</Label>
          <Select value={sellerId} onValueChange={setSellerId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select seller" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller._id} value={seller.userId?._id || seller.userId}>
                  {seller.storeName || seller.userId?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Images (comma separated URLs)</Label>
          <Input value={images} onChange={(e) => setImages(e.target.value)} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" className="mt-1" />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
