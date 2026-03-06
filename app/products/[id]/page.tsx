"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck, ArrowLeft, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const { addItem, toggleWishlist, isInWishlist } = useCart()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(data => {
      const prod = data.product
      setProduct(prod)
      if (prod?.categoryId?._id) {
        fetch(`/api/products?category=${prod.categoryId.slug}`).then(r => r.json()).then(related => {
          setRelatedProducts((related.products || []).filter((p: any) => p._id !== id).slice(0, 5))
        })
      }
    })
  }, [id])

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-lg font-medium text-foreground">Loading...</p>
        </div>
        <StoreFooter />
      </div>
    )
  }

  const inWishlist = isInWishlist(product._id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href={`/products?category=${product.categoryId?.slug}`} className="hover:text-primary">{product.categoryId?.name}</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-square">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-chart-3 text-chart-3" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
                <span className="text-sm text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">{product.sold} sold</span>
              </div>

              {/* Price */}
              <div className="mt-4 rounded-lg bg-primary/5 p-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                      <Badge className="bg-accent text-accent-foreground">-{discount}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Seller */}
              <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Sold by <strong>{product.sellerId?.storeName || product.sellerId?.name || 'Admin'}</strong></span>
                </div>
                {product.sellerId && (
                  <div className="flex gap-2">
                    <Link href={`/store/${product.sellerId._id || product.sellerId}`}>
                      <Button size="sm" variant="outline">Visit Store</Button>
                    </Link>
                    <Link href={`/messages?seller=${product.sellerId._id || product.sellerId}`}>
                      <Button size="sm" variant="outline">Message Seller</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Stock */}
              <div className="mt-4">
                <span className={`text-sm font-medium ${product.stock > 0 ? "text-chart-4" : "text-destructive"}`}>
                  {product.stock > 0 ? `${product.stock} items in stock` : "Out of stock"}
                </span>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center rounded-lg border border-border">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={() => { addItem(product._id, quantity); toast("Added to cart") }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => { toggleWishlist(product._id); toast(inWishlist ? "Removed from wishlist" : "Added to wishlist") }}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? "fill-accent text-accent" : ""}`} />
                </Button>
              </div>

              {/* Benefits */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-primary" /> Free shipping on orders over $50
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Buyer protection guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-foreground">You May Also Like</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {relatedProducts.map(p => <ProductCard key={p._id} product={{...p, id: p._id, categorySlug: p.categoryId?.slug}} />)}
              </div>
            </section>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
