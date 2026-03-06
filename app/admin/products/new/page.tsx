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
          disabled={loading}
          onClick={async () => {
            if (!categories.length) {
              toast.error('Please create a category first')
              return
            }
            setLoading(true)
            try {
              const allProducts = [
                { name: 'Wireless Bluetooth Headphones', price: 79.99, stock: 100, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
                { name: 'Smart Watch Pro', price: 199.99, stock: 75, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
                { name: 'Laptop Backpack', price: 49.99, stock: 150, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600' },
                { name: 'Power Bank 20000mAh', price: 34.99, stock: 200, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600' },
                { name: 'Gaming Mouse RGB', price: 59.99, stock: 120, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600' },
                { name: 'USB-C Hub Adapter', price: 39.99, stock: 180, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600' },
                { name: 'Mechanical Keyboard', price: 89.99, stock: 90, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600' },
                { name: 'Webcam HD 1080p', price: 69.99, stock: 110, image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600' },
                { name: 'Phone Stand Adjustable', price: 24.99, stock: 250, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600' },
                { name: 'LED Desk Lamp', price: 44.99, stock: 140, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600' },
                { name: 'Bluetooth Speaker', price: 54.99, stock: 160, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600' },
                { name: 'Wireless Charger Pad', price: 29.99, stock: 220, image: 'https://images.unsplash.com/photo-1591290619762-c588f0e8e23f?w=600' },
                { name: 'Cable Organizer Set', price: 19.99, stock: 300, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
                { name: 'Screen Protector Glass', price: 14.99, stock: 350, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600' },
                { name: 'Laptop Cooling Pad', price: 39.99, stock: 130, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600' },
                { name: 'Portable SSD 1TB', price: 129.99, stock: 60, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600' },
                { name: 'Noise Cancelling Earbuds', price: 149.99, stock: 85, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600' },
                { name: 'Fitness Tracker Band', price: 79.99, stock: 95, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600' },
                { name: 'Tablet Stand Holder', price: 34.99, stock: 175, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404f1e9?w=600' },
                { name: 'Ring Light for Video', price: 64.99, stock: 105, image: 'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=600' }
              ]
              
              const shuffled = allProducts.sort(() => 0.5 - Math.random())
              const selected = shuffled.slice(0, 5)
              
              let added = 0
              for (const p of selected) {
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
                if (res.ok) {
                  added++
                  console.log(`✅ Added: ${p.name}`)
                } else {
                  const err = await res.json()
                  console.error(`❌ Failed: ${p.name}`, err)
                }
              }
              if (added > 0) {
                toast.success(`Added ${added} virtual products to database`)
                setTimeout(() => router.push('/admin/products'), 1000)
              } else {
                toast.error('Failed to add products. Check console for errors.')
              }
            } catch (e) {
              console.error('Error:', e)
              toast.error('Failed to add products: ' + e.message)
            }
            setLoading(false)
          }}
        >
          {loading ? 'Adding...' : 'Add 5 Random Products'}
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
