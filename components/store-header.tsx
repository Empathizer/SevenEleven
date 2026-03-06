"use client"

import React from "react"

import Link from "next/link"
import { useState } from "react"
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Package, LogOut, LayoutDashboard, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

export function StoreHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems, wishlist } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <span>Free shipping on orders over $50</span>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/seller/register" className="hover:underline">Sell on EsellerStore</Link>
            <Link href="/help" className="hover:underline">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card">
            <nav className="mt-8 flex flex-col gap-2">
              <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Home</Link>
              <Link href="/products" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">All Products</Link>
              <Link href="/products?category=jewelry" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Jewelry</Link>
              <Link href="/products?category=fashion" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Fashion</Link>
              <Link href="/products?category=shoes" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Shoes</Link>
              <Link href="/products?category=beauty" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Beauty</Link>
              <Link href="/products?category=accessories" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Accessories</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:block">EsellerStore</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center">
          <div className="relative flex w-full max-w-2xl">
            <Input
              placeholder="Search products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0 bg-muted pr-10"
            />
            <Button type="submit" className="rounded-l-none bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isAuthenticated && user?.role === 'customer' && (
            <Link href="/messages">
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>
          )}
          
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
                  {wishlist.length}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden text-sm md:inline">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                {user.role === "seller" && (
                  <DropdownMenuItem asChild>
                    <Link href="/seller"><LayoutDashboard className="mr-2 h-4 w-4" />Seller Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user.role === "customer" && (
                  <DropdownMenuItem asChild>
                    <Link href="/orders"><Package className="mr-2 h-4 w-4" />My Orders</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Categories bar */}
      <nav className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 text-sm">
          <Link href="/products" className="font-medium text-primary hover:underline">All Products</Link>
          <Link href="/products?category=jewelry" className="text-muted-foreground hover:text-foreground">Jewelry</Link>
          <Link href="/products?category=fashion" className="text-muted-foreground hover:text-foreground">Fashion</Link>
          <Link href="/products?category=mens-apparel" className="text-muted-foreground hover:text-foreground">{"Men's Apparel"}</Link>
          <Link href="/products?category=womens-apparel" className="text-muted-foreground hover:text-foreground">{"Women's Apparel"}</Link>
          <Link href="/products?category=shoes" className="text-muted-foreground hover:text-foreground">Shoes</Link>
          <Link href="/products?category=accessories" className="text-muted-foreground hover:text-foreground">Accessories</Link>
          <Link href="/products?category=beauty" className="text-muted-foreground hover:text-foreground">Beauty</Link>
        </div>
      </nav>
    </header>
  )
}
