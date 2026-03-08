"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Store, MapPin, Star, MessageSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { ProductCard } from "@/components/product-card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function SellerStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [seller, setSeller] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/sellers/${id}`).then(r => r.json()),
      fetch(`${API_URL}/api/products?sellerId=${id}`).then(r => r.json())
    ]).then(([sellerData, productsData]) => {
      if (sellerData.success) setSeller(sellerData.seller)
      if (productsData.success) setProducts(productsData.products || productsData.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading store...</p>
        </div>
        <StoreFooter />
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <div className="flex flex-1 flex-col items-center justify-center">
          <Store className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium text-foreground">Store not found or not verified</p>
          <p className="text-sm text-muted-foreground mt-2">This seller may be pending approval</p>
          <Link href="/products" className="mt-4">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Back button */}
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          {/* Store Header */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{seller.storeName || seller.name}</h1>
                {seller.storeDescription && (
                  <p className="mt-2 text-sm text-muted-foreground">{seller.storeDescription}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {seller.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{seller.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
                    <span>{seller.rating || 5.0} Rating</span>
                  </div>
                  <div>
                    <span>{products.length} Products</span>
                  </div>
                </div>
              </div>
              <Link href={`/messages?seller=${id}`}>
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message Seller
                </Button>
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Store Products ({products.length})</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={{
                      ...product, 
                      id: product._id, 
                      categorySlug: product.categoryId?.slug,
                      sellerName: seller.storeName || seller.name
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Store className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-foreground">No products yet</p>
                <p className="text-sm text-muted-foreground">This store hasn't added any products</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
