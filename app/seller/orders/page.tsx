"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 20

export default function SellerOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadOrders()
      loadWallet()
    }
  }, [user])

  const loadWallet = async () => {
    try {
      const res = await fetch(`${API_URL}/api/seller/wallet`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setWalletBalance(data.data?.walletBalance || 0)
      }
    } catch (e) {}
    setLoading(false)
  }

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) setOrders(data.orders || [])
      }
    } catch (e) {}
  }

  const updateStatus = async (orderId: string, status: string, requiredAmount: number) => {
    if ((status === 'processing' || status === 'shipped') && walletBalance < requiredAmount) {
      toast.error(`Insufficient wallet balance. Required: $${requiredAmount.toFixed(2)}, Available: $${walletBalance.toFixed(2)}`)
      return
    }
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Order updated to ${status}`)
        loadOrders()
        loadWallet()
      } else {
        toast.error(data.message || 'Failed to update order')
      }
    } catch (e) {
      toast.error('Failed to update order')
    }
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
            {orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((order) => {
              const myItems = order.items.filter((i: any) => i.sellerId === user._id)
              const myTotal = myItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
              const buyingCost = myItems.reduce((s: number, i: any) => s + (i.buyingPrice || 0) * i.quantity, 0)
              const canFulfill = !loading && walletBalance !== null && walletBalance >= buyingCost
              
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
                    {loading ? (
                      <p className="text-xs text-muted-foreground">Loading...</p>
                    ) : (
                      <>
                        {!canFulfill && order.status === 'pending' && (
                          <p className="text-xs text-destructive mb-1">Need ${buyingCost.toFixed(2)} to fulfill</p>
                        )}
                        <Select value={order.status} onValueChange={(v) => updateStatus(order._id, v, buyingCost)} disabled={!canFulfill && order.status === 'pending'}>
                          <SelectTrigger className="w-32 bg-muted"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing" disabled={!canFulfill}>Processing</SelectItem>
                            <SelectItem value="shipped" disabled={!canFulfill}>Shipped</SelectItem>
                            <SelectItem value="delivered" disabled={!canFulfill && order.status === 'pending'}>Delivered</SelectItem>
                            <SelectItem value="cancelled" disabled={!canFulfill && order.status === 'pending'}>Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
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

      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(orders.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
