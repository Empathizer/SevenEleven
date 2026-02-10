"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStore, type OrderStatus } from "@/lib/store"
import { toast } from "sonner"

export default function AdminOrdersPage() {
  const store = getStore()
  const [, setRefresh] = useState(0)
  const orders = store.getOrders({})

  const updateStatus = (orderId: string, status: OrderStatus) => {
    store.updateOrderStatus(orderId, status)
    setRefresh(v => v + 1)
    toast(`Order updated to ${status}`)
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
    <div>
      <h1 className="text-2xl font-bold text-foreground">Manage Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">View and update order statuses across the platform.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                <TableCell className="text-muted-foreground">{order.items.length} items</TableCell>
                <TableCell className="font-medium text-primary">${order.total.toFixed(2)}</TableCell>
                <TableCell><Badge className={statusColor(order.status)}>{order.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
