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
  const [virtualSellers, setVirtualSellers] = useState<any[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sellerId, setSellerId] = useState("")
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
      .catch(e => console.error('Failed to load categories:', e))
    
    fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const virtuals = data.data.filter((s: any) => {
            const email = s.userId?.email || s.email || ''
            return email.includes('seller') && email.includes('@')
          })
          setVirtualSellers(virtuals)
        }
      })
      .catch(e => console.error('Failed to load sellers:', e))
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
          sellerId: sellerId && sellerId !== 'none' ? sellerId : null,
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
          disabled={loading || !sellerId || sellerId === 'none'}
          onClick={async () => {
            if (!categories.length) {
              toast.error('Please create a category first')
              return
            }
            if (!sellerId || sellerId === 'none') {
              toast.error('Please select a virtual seller first')
              return
            }
            setLoading(true)
            try {
              const res = await fetch(`${API_URL}/api/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  name: `Product ${Date.now()}`,
                  description: `Unique product created at ${new Date().toISOString()}`,
                  price: Math.floor(Math.random() * 200) + 20,
                  buyingPrice: 0,
                  categoryId: categories[0]._id,
                  sellerId: null,
                  stock: Math.floor(Math.random() * 200) + 50,
                  images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop']
                })
              })
              if (res.ok) {
                toast.success('Virtual product added')
                router.push('/admin/admin-products')
              } else {
                toast.error('Failed to add product')
              }
            } catch (e) {
              toast.error('Failed to add product')
            }
            setLoading(false)
          }}
        >
          {loading ? 'Adding...' : 'Add Unique Virtual Product'}
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
          <Label>Virtual Seller (Optional)</Label>
          <Select value={sellerId} onValueChange={setSellerId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select virtual seller or leave empty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Seller (Catalogue)</SelectItem>
              {virtualSellers.map((seller) => {
                const userId = typeof seller.userId === 'string' ? seller.userId : seller.userId?._id
                const userName = typeof seller.userId === 'string' ? seller.storeName : (seller.storeName || seller.userId?.name)
                const userEmail = typeof seller.userId === 'string' ? '' : seller.userId?.email
                return (
                  <SelectItem key={seller._id} value={userId || ''}>
                    {userName} {userEmail ? `(${userEmail})` : ''}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Select a virtual seller to associate this product</p>
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
