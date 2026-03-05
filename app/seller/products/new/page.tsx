"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [buyingPrice, setBuyingPrice] = useState("")
  const [stock, setStock] = useState("")
  const [seller, setSeller] = useState<any>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        console.log('Products loaded:', data)
        setProducts(data.data || [])
        setFilteredProducts(data.data || [])
      })
      .catch(err => console.error('Products fetch error:', err))
    
    fetch(`${API_URL}/api/seller/profile`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        console.log('Seller profile:', data)
        setSeller(data.data)
      })
      .catch(err => console.error('Profile fetch error:', err))
  }, [])

  useEffect(() => {
    if (search) {
      setFilteredProducts(products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      ))
    } else {
      setFilteredProducts(products)
    }
  }, [search, products])

  if (!user) return null

  if (seller?.status !== 'approved') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Product to Your Store</h1>
        <Alert className="mt-6 max-w-2xl border-orange-500 bg-orange-50 dark:bg-orange-950">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            Your seller account is pending approval. You can add products after your account is verified by admin.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/seller')} className="mt-4" variant="outline">Back to Dashboard</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) { toast.error("Please select a product"); return }

    const res = await fetch(`${API_URL}/api/seller/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: Number(buyingPrice),
        buyingPrice: selectedProduct.originalPrice || selectedProduct.price,
        originalPrice: selectedProduct.originalPrice,
        images: selectedProduct.images,
        categoryId: selectedProduct.categoryId,
        stock: Number(stock),
        featured: false,
      })
    })

    if (res.ok) {
      toast.success("Product added successfully!")
      router.push("/seller/products")
    } else {
      toast.error("Failed to add product")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Add Product to Your Store</h1>
      <p className="mt-1 text-sm text-muted-foreground">Select a product from the catalog to sell in your store.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  placeholder="Search by product name" 
                  className="bg-muted pl-10" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Select Product</Label>
              <Select value={selectedProduct?._id} onValueChange={(id) => {
                const product = products.find(p => p._id === id)
                setSelectedProduct(product)
              }}>
                <SelectTrigger className="bg-muted">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent className="bg-card max-h-[300px]">
                  {filteredProducts.map(product => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} - ${product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex gap-4">
                    {selectedProduct.images?.[0] && (
                      <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedProduct.description}</p>
                      <p className="text-sm font-semibold mt-2">Original Price: ${selectedProduct.originalPrice || selectedProduct.price}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Your Selling Price ($)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={buyingPrice} 
                    onChange={e => setBuyingPrice(e.target.value)} 
                    placeholder="Set your price" 
                    required 
                    className="bg-muted" 
                  />
                  <p className="text-xs text-muted-foreground">Buying cost: ${selectedProduct.originalPrice || selectedProduct.price} | Your profit: ${buyingPrice ? (Number(buyingPrice) - (selectedProduct.originalPrice || selectedProduct.price)).toFixed(2) : '0.00'} per unit</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Stock Quantity</Label>
                  <Input 
                    type="number" 
                    value={stock} 
                    onChange={e => setStock(e.target.value)} 
                    placeholder="How many units?" 
                    required 
                    className="bg-muted" 
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground hover:bg-primary/90" 
            size="lg"
            disabled={!selectedProduct || !buyingPrice || !stock}
          >
            Add to My Store
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push("/seller/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
