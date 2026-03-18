"use client"

import Link from "next/link"
import { ArrowRight, Truck, ShieldCheck, RefreshCcw, Headphones, User, Store as StoreIcon, ShieldCheck as AdminIcon } from "lucide-react"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { HeroBanner } from "@/components/hero-banner"
import { ProductCard } from "@/components/product-card"
import { ChatWidget } from "@/components/chat-widget"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/products/categories").then(r => r.json()),
      fetch("/api/products?featured=true&limit=100").then(r => r.json()),
      fetch("/api/products?limit=200").then(r => r.json())
    ]).then(([cats, featured, all]) => {
      setCategories(cats.categories || cats.data || [])
      setFeaturedProducts(featured.data || featured.products || [])
      setAllProducts(all.data || all.products || [])
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-4">
          <HeroBanner />
        </section>

        {/* Trust badges */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <RefreshCcw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30 day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Dedicated help</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Shop by Category</h2>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="text-center text-xs font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="bg-primary/5 py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground md:text-2xl">Featured Products</h2>
                <p className="mt-1 text-sm text-muted-foreground">Handpicked deals just for you</p>
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                See All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {featuredProducts.slice(0, 20).map((product) => (
                <ProductCard key={product._id} product={{...product, id: product._id, sellerName: product.sellerId?.name || 'Unknown'}} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo banner */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="overflow-hidden rounded-xl bg-primary">
            <div className="flex flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row md:py-10">
              <div>
                <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">Become a Seller</h2>
                <p className="mt-2 max-w-md text-sm text-primary-foreground/80">
                  Join thousands of sellers and reach millions of customers. Start your online business today.
                </p>
              </div>
              <Link href="/seller/register" className="shrink-0 rounded-lg bg-card px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-card/90">
                Start Selling
              </Link>
            </div>
          </div>
        </section>

        {/* All products */}
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Just For You</h2>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={{...product, id: product._id, sellerName: product.sellerId?.name || 'Unknown'}} />
            ))}
          </div>
        </section>
      </main>

      <StoreFooter />
      <ChatWidget />
    </div>
  )
}
