"use client"

import { useSearchParams } from "next/navigation"
import { useState, useMemo, Suspense, useEffect } from "react"
import { SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { ProductCard } from "@/components/product-card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 24

function ProductsContent() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category") || ""
  const searchQuery = searchParams.get("search") || ""

  const [categories, setCategories] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [sort, setSort] = useState("popular")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/products/categories`).then(r => r.json()),
      fetch(`${API_URL}/api/products?category=${categorySlug}&search=${searchQuery}`).then(r => r.json()),
      searchQuery ? fetch(`${API_URL}/api/sellers?search=${searchQuery}`).then(r => r.json()) : Promise.resolve({ data: [] })
    ]).then(([cats, prods, sellers]) => {
      setCategories(cats.categories || cats.data || [])
      setAllProducts(prods.data || prods.products || [])
      setStores(sellers.data || [])
    })
  }, [categorySlug, searchQuery])

  const products = useMemo(() => {
    let result = allProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sort) {
      case "price-low": return [...result].sort((a, b) => a.price - b.price)
      case "price-high": return [...result].sort((a, b) => b.price - a.price)
      case "rating": return [...result].sort((a, b) => b.rating - a.rating)
      case "newest": return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default: return [...result].sort((a, b) => b.sold - a.sold)
    }
  }, [allProducts, sort, priceRange])

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [categorySlug, searchQuery, sort, priceRange])

  const activeCat = categories.find(c => c.slug === categorySlug)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary"><a href="/">Home</a></span>
            <span className="mx-2">/</span>
            {activeCat ? (
              <span className="text-foreground">{activeCat.name}</span>
            ) : searchQuery ? (
              <span className="text-foreground">Search: {`"${searchQuery}"`}</span>
            ) : (
              <span className="text-foreground">All Products</span>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar filters */}
            <aside className="w-full shrink-0 lg:w-56">
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h3>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Category</p>
                  <div className="flex flex-col gap-1">
                    <a
                      href="/products"
                      className={`rounded px-2 py-1.5 text-sm ${!categorySlug ? "bg-primary/10 font-medium text-primary" : "text-foreground hover:bg-muted"}`}
                    >
                      All Categories
                    </a>
                    {categories.map(cat => (
                      <a
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        className={`rounded px-2 py-1.5 text-sm ${categorySlug === cat.slug ? "bg-primary/10 font-medium text-primary" : "text-foreground hover:bg-muted"}`}
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Price Range</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="h-8 text-xs"
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="h-8 text-xs"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{products.length} products found</p>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-40 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paginatedProducts.length > 0 || stores.length > 0 ? (
                <>
                  {stores.length > 0 && searchQuery && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">Stores</h2>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {stores.map(store => (
                          <a key={store._id} href={`/store/${store.userId?._id || store.userId}`} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">{store.storeName?.charAt(0) || 'S'}</span>
                              </div>
                              <h3 className="font-medium text-sm">{store.storeName}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{store.productCount || 0} products</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {paginatedProducts.length > 0 && (
                    <>
                      {searchQuery && stores.length > 0 && <h2 className="text-lg font-semibold mb-3">Products</h2>}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {paginatedProducts.map(product => (
                          <ProductCard key={product._id} product={{...product, id: product._id, categorySlug: product.categoryId?.slug}} />
                        ))}
                      </div>
                      
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-lg font-medium text-foreground">No products found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  )
}
