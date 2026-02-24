"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Download, Trash2, Eye } from "lucide-react"

export default function AdvancedOrdersPage() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const fetchOrders = async () => {
    try {
      const url = filter === "all" 
        ? '/api/admin/orders' 
        : `/api/admin/orders?deliveryStatus=${filter}`
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const updateStatus = async (orderId: string, deliveryStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ deliveryStatus })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Status updated")
        fetchOrders()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Delete this order?")) return
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Order deleted")
        fetchOrders()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to delete order")
    }
  }

  const downloadReceipt = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/receipt`, {
        credentials: 'include'
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${orderId}.pdf`
      a.click()
    } catch (error) {
      toast.error("Failed to download receipt")
    }
  }

  const viewDetails = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setSelectedOrder(data.data)
        setShowDetails(true)
      }
    } catch (error) {
      toast.error("Failed to load order details")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advanced Order Management</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Picked Up">Picked Up</SelectItem>
            <SelectItem value="On The Way">On The Way</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancel">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Virtual</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell className="font-mono text-xs">{order._id.slice(-8)}</TableCell>
              <TableCell>{order.userId?.name}</TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                <Select value={order.deliveryStatus} onValueChange={(val) => updateStatus(order._id, val)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Picked Up">Picked Up</SelectItem>
                    <SelectItem value="On The Way">On The Way</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancel">Cancel</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {order.isVirtualOrder && <Badge variant="secondary">Virtual</Badge>}
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => viewDetails(order._id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadReceipt(order._id)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteOrder(order._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Customer: {selectedOrder.userId?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.userId?.email}</p>
              </div>
              <div>
                <p className="font-semibold">Shipping Address:</p>
                <p className="text-sm">{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <p className="font-semibold">Items:</p>
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm border-b py-2">
                    <p>{item.productName}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity} x ${item.price}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${selectedOrder.totalAmount}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
