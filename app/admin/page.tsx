"use client"

import { DollarSign, ShoppingCart, Users, Package, Store, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStore } from "@/lib/store"

export default function AdminDashboard() {
  const store = getStore()
  const stats = store.getAdminStats()
  const recentOrders = store.getOrders({}).slice(0, 5)
  const pendingSellers = store.getPendingSellers()

  const statCards = [
    { label: "Total Sales", value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: "text-chart-1" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-chart-2" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-chart-3" },
    { label: "Total Sellers", value: stats.totalSellers, icon: Store, color: "text-chart-4" },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-chart-5" },
    { label: "Pending Sellers", value: stats.pendingSellers, icon: Clock, color: "text-accent" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome to the admin panel. Here is an overview of your platform.</p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
                    <Badge variant={order.status === "delivered" ? "default" : "secondary"} className={
                      order.status === "delivered" ? "bg-chart-4 text-primary-foreground" :
                      order.status === "shipped" ? "bg-chart-1 text-primary-foreground" :
                      order.status === "processing" ? "bg-chart-3 text-primary-foreground" :
                      order.status === "cancelled" ? "bg-destructive text-destructive-foreground" :
                      "bg-muted text-muted-foreground"
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending sellers */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Pending Seller Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingSellers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending approvals</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingSellers.map((seller) => (
                  <div key={seller.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{seller.storeName || seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.email}</p>
                    </div>
                    <Badge className="bg-chart-3 text-primary-foreground">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
