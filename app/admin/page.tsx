"use client"

import { useState, useEffect } from "react"
import { DollarSign, ShoppingCart, Users, Package, Store, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalSellers: 0, totalUsers: 0, pendingSellers: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [pendingSellers, setPendingSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const [dashRes, ordersRes, sellersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard`, { credentials: 'include', signal: controller.signal }),
        fetch(`${API_URL}/api/admin/orders`, { credentials: 'include', signal: controller.signal }),
        fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include', signal: controller.signal })
      ])

      clearTimeout(timeout)

      if (dashRes.ok) {
        const data = await dashRes.json()
        if (data.success) setStats(data.stats)
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json()
        if (data.success) setRecentOrders(data.orders?.slice(0, 5) || [])
      }

      if (sellersRes.ok) {
        const data = await sellersRes.json()
        if (data.success) {
          const pending = data.data.filter((s: any) => s.status === 'pending')
          setPendingSellers(pending)
        }
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: "Total Sales", value: `$${(stats.totalSales || 0).toFixed(2)}`, icon: DollarSign, color: "text-chart-1" },
    { label: "Total Orders", value: stats.totalOrders || 0, icon: ShoppingCart, color: "text-chart-2" },
    { label: "Total Products", value: stats.totalProducts || 0, icon: Package, color: "text-chart-3" },
    { label: "Total Sellers", value: stats.totalSellers || 0, icon: Store, color: "text-chart-4" },
    { label: "Total Customers", value: stats.totalUsers || 0, icon: Users, color: "text-chart-5" },
    { label: "Pending Sellers", value: stats.pendingSellers || 0, icon: Clock, color: "text-accent" },
  ]

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  }

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
                <div key={order._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order._id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
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
                  <div key={seller._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{seller.storeName || seller.userId?.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.userId?.email}</p>
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
