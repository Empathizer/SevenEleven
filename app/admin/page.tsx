"use client"

import { useState, useEffect } from "react"
import { DollarSign, ShoppingCart, Users, Package, Store, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalSellers: 0, totalUsers: 0, pendingSellers: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [pendingSellers, setPendingSellers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dashRes, ordersRes, sellersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard`, { credentials: 'include' }),
        fetch(`${API_URL}/api/admin/orders`, { credentials: 'include' }),
        fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include' })
      ])

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

      fetch(`${API_URL}/api/products?limit=6`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => data.success && setProducts(data.products || []))

      fetch(`${API_URL}/api/admin/categories`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => data.success && setCategories(data.categories?.slice(0, 6) || []))

      fetch(`${API_URL}/api/admin/banners`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => data.success && setBanners(data.banners?.filter((b: any) => b.isActive) || []))
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

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Mon', sales: 120 },
                { name: 'Tue', sales: 200 },
                { name: 'Wed', sales: 150 },
                { name: 'Thu', sales: 180 },
                { name: 'Fri', sales: 250 },
                { name: 'Sat', sales: 300 },
                { name: 'Sun', sales: 220 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: recentOrders.filter(o => o.status === 'pending').length || 1 },
                    { name: 'Processing', value: recentOrders.filter(o => o.status === 'processing').length || 1 },
                    { name: 'Shipped', value: recentOrders.filter(o => o.status === 'shipped').length || 1 },
                    { name: 'Delivered', value: recentOrders.filter(o => o.status === 'delivered').length || 1 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Products */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <div key={product._id} className="rounded-lg border border-border p-2">
                  <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-full h-24 object-cover rounded" />
                  <p className="text-xs font-medium text-foreground mt-2 truncate">{product.name}</p>
                  <p className="text-xs text-primary font-bold">${product.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 6).map((cat) => (
                <div key={cat._id} className="rounded-lg border border-border p-2">
                  <img src={cat.image || '/placeholder.svg'} alt={cat.name} className="w-full h-20 object-cover rounded" />
                  <p className="text-xs font-medium text-foreground mt-2">{cat.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banners */}
      {banners.length > 0 && (
        <Card className="mt-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Active Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {banners.filter(b => b.isActive).map((banner) => (
                <div key={banner._id} className="rounded-lg border border-border overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground">{banner.title}</p>
                    <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
