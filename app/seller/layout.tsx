"use client"

import React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Store, LogOut, ChevronLeft, Menu, Plus, Wallet, MessageCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

const navItems = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/products/new", label: "Add Product", icon: Plus },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
  { href: "/seller/messages", label: "Messages", icon: MessageCircle },
  { href: "/seller/wallet", label: "Wallet", icon: Wallet },
  { href: "/seller/store", label: "Store Profile", icon: Store },
  { href: "/seller/support", label: "Support", icon: MessageCircle },
]

function SidebarNav({ pathname }: { pathname: string }) {
  const { logout, user } = useAuth()
  const [seller, setSeller] = useState<any>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/seller/profile`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setSeller(data.data))
  }, [])

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Store className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{user?.storeName || "Seller Panel"}</span>
            {seller?.status === 'approved' && (
              <Badge className="bg-green-500 text-white text-[10px] px-1 py-0 h-4">
                <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> Verified
              </Badge>
            )}
          </div>
          <span className="text-xs text-sidebar-foreground/60">Seller Dashboard</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
          <ChevronLeft className="h-4 w-4" /> Back to Store
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "seller")) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, user, router])

  if (loading || !isAuthenticated || user?.role !== "seller") {
    return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <SidebarNav pathname={pathname} />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-64 p-0"><SidebarNav pathname={pathname} /></SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground">Seller Dashboard</span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
