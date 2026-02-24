"use client"

import Link from "next/link"
import { Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetch("/api/orders", { credentials: "include" })
        .then(r => r.json())
        .then(data => setOrders(data.data || []))
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-lg font-medium text-foreground">Please login to view your orders</p>
          <Link href="/login"><Button className="mt-4 bg-primary text-primary-foreground">Login</Button></Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-chart-4 text-primary-foreground"
      case "shipped": return "bg-chart-1 text-primary-foreground"
      case "processing": return "bg-chart-3 text-primary-foreground"
      case "cancelled": return "bg-destructive text-destructive-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage your orders.</p>

          {orders.length === 0 ? (
            <div className="mt-12 flex flex-col items-center text-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Start shopping to see your orders here</p>
              <Link href="/products">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order._id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{order._id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <Badge className={statusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.productImage || "/placeholder.svg"} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" crossOrigin="anonymous" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                        </div>
                        <span className="text-sm font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Shipping:</span> {order.shippingAddress}
                    </div>
                    <div className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
