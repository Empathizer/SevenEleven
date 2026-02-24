"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function SellerOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (user) loadOrders()
  }, [user])

  const loadOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) setOrders(data.orders || [])
      }
    } catch (e) {}
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Order updated to ${status}`)
        loadOrders()
      }
    } catch (e) {}
  }

  if (!user) return null

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
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage orders for your products.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const myItems = order.items.filter((i: any) => i.sellerId === user.id)
              const myTotal = myItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
              return (
                <TableRow key={order._id}>
                  <TableCell className="font-medium text-foreground">{order._id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {myItems.map((item, idx) => (
                        <span key={idx} className="text-xs text-muted-foreground">{item.productName} x{item.quantity}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-primary">${myTotal.toFixed(2)}</TableCell>
                  <TableCell><Badge className={statusColor(order.status)}>{order.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Select value={order.status} onValueChange={(v) => updateStatus(order._id, v)}>
                      <SelectTrigger className="w-32 bg-muted"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )
            })}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No orders yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
