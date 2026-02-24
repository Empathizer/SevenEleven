"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"

export default function WishlistPage() {
  const { wishlist } = useCart()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (wishlist.length > 0) {
      Promise.all(wishlist.map(id => 
        fetch(`http://localhost:5000/api/products/${id}`).then(r => r.json()).then(d => d.data)
      )).then(prods => setProducts(prods.filter(Boolean)))
    } else {
      setProducts([])
    }
  }, [wishlist])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">My Wishlist ({products.length} items)</h1>

          {products.length === 0 ? (
            <div className="mt-12 flex flex-col items-center text-center">
              <Heart className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-foreground">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Save items you love for later</p>
              <Link href="/products">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map(product => product && <ProductCard key={product._id} product={{...product, id: product._id, categorySlug: product.categoryId?.slug}} />)}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
