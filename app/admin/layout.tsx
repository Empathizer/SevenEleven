"use client"

import React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import {
  LayoutDashboard, Users, Package, Tag, ImageIcon, ShoppingCart, DollarSign, LogOut, ChevronLeft, Menu,
  UserPlus, Settings, FileText, Wallet, MessageCircle, Headphones, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sellers", label: "Sellers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/virtual-customers", label: "Virtual Customers", icon: UserPlus },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
  { href: "/admin/chats", label: "Chats", icon: MessageSquare },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle },
]

function SidebarNav({ pathname }: { pathname: string }) {
  const { logout } = useAuth()
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Package className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold">Admin Panel</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
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
          <ChevronLeft className="h-4 w-4" />
          Back to Store
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, user, router])

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarNav pathname={pathname} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground">Admin Panel</span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
