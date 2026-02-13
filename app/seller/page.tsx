"use client"

import { DollarSign, ShoppingCart, Package, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { getStore } from "@/lib/store"

export default function SellerDashboard() {
  const { user } = useAuth()
  const store = getStore()

  if (!user) return null
  const stats = store.getSellerStats(user.id)
  const wallet = store.getSellerWallet(user.id)

  const statCards = [
    { label: "Wallet Balance", value: `$${(wallet?.walletBalance || 0).toFixed(2)}`, icon: Wallet, color: "text-primary" },
    { label: "Total Sales", value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: "text-chart-1" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-chart-2" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-chart-3" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Seller Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back, {user.storeName || user.name}!</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top products */}
      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet. Start by adding your first product!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </span>
                  <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-12 w-12 rounded-lg object-cover" crossOrigin="anonymous" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                  </div>
                  <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
