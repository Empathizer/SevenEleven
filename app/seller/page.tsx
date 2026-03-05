"use client"

import { useState, useEffect } from "react"
import { DollarSign, ShoppingCart, Package, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function SellerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, topProducts: [] })
  const [wallet, setWallet] = useState({ walletBalance: 0, pendingBalance: 0, totalEarnings: 0, totalWithdrawn: 0, storeName: '', guaranteeMoney: 0, creditScore: 100 })

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [walletRes, productsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/seller/wallet`, { credentials: 'include' }),
        fetch(`${API_URL}/api/seller/products`, { credentials: 'include' }),
        fetch(`${API_URL}/api/seller/orders`, { credentials: 'include' })
      ])
      
      console.log('Wallet status:', walletRes.status)
      console.log('Products status:', productsRes.status)
      console.log('Orders status:', ordersRes.status)
      
      if (walletRes.ok) {
        const data = await walletRes.json()
        console.log('Wallet data:', JSON.stringify(data))
        if (data.success) setWallet(data.data)
      }
      
      if (productsRes.ok && ordersRes.ok) {
        const products = await productsRes.json()
        const orders = await ordersRes.json()
        console.log('Products:', JSON.stringify(products))
        console.log('Orders:', JSON.stringify(orders))
        
        if (products.success && orders.success) {
          const totalSales = (orders.data || []).reduce((sum, o) => sum + o.totalAmount, 0)
          const topProducts = (products.data || []).sort((a, b) => b.sold - a.sold).slice(0, 5)
          
          setStats({
            totalSales,
            totalOrders: (orders.data || []).length,
            totalProducts: (products.data || []).length,
            topProducts
          })
        }
      }
    } catch (e) {
      console.error('Load error:', e)
    }
  }

  if (!user) return null

  const statCards = [
    { label: "Wallet Balance", value: `$${(wallet?.walletBalance || 0).toFixed(2)}`, icon: Wallet, color: "text-primary" },
    { label: "Pending Balance", value: `$${(wallet?.pendingBalance || 0).toFixed(2)}`, icon: DollarSign, color: "text-orange-500" },
    { label: "Total Earnings", value: `$${(wallet?.totalEarnings || 0).toFixed(2)}`, icon: TrendingUp, color: "text-green-500" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-chart-3" },
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
                <div key={product._id} className="flex items-center gap-4 rounded-lg border border-border p-3">
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
