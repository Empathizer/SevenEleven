"use client"

import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/store"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart()
  const inWishlist = isInWishlist(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          crossOrigin="anonymous"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => {
          toggleWishlist(product.id)
          toast(inWishlist ? "Removed from wishlist" : "Added to wishlist")
        }}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow-sm transition-colors hover:bg-card"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${inWishlist ? "fill-accent text-accent" : "text-muted-foreground"}`} />
      </button>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product.id}`} className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-chart-3 text-chart-3" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
          <span className="text-xs text-muted-foreground">| {product.sold} sold</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">{product.sellerName}</div>

        {/* Add to cart */}
        <Button
          size="sm"
          className="mt-3 w-full gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            addItem(product.id)
            toast("Added to cart")
          }}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
