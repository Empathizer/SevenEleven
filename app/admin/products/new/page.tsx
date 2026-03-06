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
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [stock, setStock] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(files)
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreview(previews)
  }

  useEffect(() => {
    fetch(`${API_URL}/api/admin/categories`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrls: string[] = []
      
      if (imageFiles.length > 0) {
        const formData = new FormData()
        imageFiles.forEach(file => formData.append('images', file))
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        })
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrls = uploadData.urls || []
        }
      }

      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          buyingPrice: 0,
          categoryId,
          sellerId: null,
          stock: parseInt(stock),
          images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop'],
          isCatalogue: true
        })
      })

      if (res.ok) {
        toast.success("Product added to catalogue")
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Product to Catalogue</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add a product that sellers can fetch and sell.</p>
        </div>
        <Button 
          type="button"
          variant="outline"
          onClick={async () => {
            if (!categories.length) {
              toast.error('Please create a category first')
              return
            }
            setLoading(true)
            try {
              const virtualProducts = [
                { name: 'Wireless Headphones', price: 79.99, stock: 100, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
                { name: 'Smart Watch', price: 199.99, stock: 75, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
                { name: 'Laptop Backpack', price: 49.99, stock: 150, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600' },
                { name: 'Power Bank', price: 34.99, stock: 200, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600' },
                { name: 'Gaming Mouse', price: 59.99, stock: 120, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600' }
              ]
              
              let added = 0
              for (const p of virtualProducts) {
                const res = await fetch(`${API_URL}/api/admin/products`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    name: p.name,
                    description: `High quality ${p.name.toLowerCase()} for everyday use`,
                    price: p.price,
                    buyingPrice: 0,
                    categoryId: categories[0]._id,
                    sellerId: null,
                    stock: p.stock,
                    images: [p.image]
                  })
                })
                if (res.ok) added++
              }
              toast.success(`Added ${added} virtual products`)
              router.push('/admin/products')
            } catch (e) {
              toast.error('Failed to add products')
            }
            setLoading(false)
          }}
        >
          Add 5 Virtual Products
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
        <div>
          <Label>Product Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1" />
        </div>

        <div>
          <Label>Price</Label>
          <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1" />
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
          <Label>Product Images</Label>
          <Input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange} 
            className="mt-1" 
          />
          <p className="text-xs text-muted-foreground mt-1">Upload product images (multiple allowed)</p>
          
          {imagePreview.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {imagePreview.map((preview, idx) => (
                <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded border" />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add to Catalogue"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
