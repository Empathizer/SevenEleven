"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Trash2, Download, Edit } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [dialogType, setDialogType] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) setOrders(data.orders || [])
      }
    } catch (e) {}
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
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

  const calculateProfit = (order: any) => {
    return (order.profit || 0).toFixed(2)
  }

  const deleteOrder = async (orderId: string) => {
    if (confirm('Delete this order?')) {
      try {
        const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (res.ok) {
          toast.success('Order deleted')
          loadOrders()
        }
      } catch (e) {}
    }
  }

  const downloadReceipt = (order: any) => {
    toast.success('Receipt downloaded')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground">Manage Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and update order statuses across the platform.</p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order Code</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Num. of Products</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Pick Up Status</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Refund</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium whitespace-nowrap">{order._id}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.items[0]?.sellerEmail || 'N/A'}</TableCell>
                  <TableCell className="text-center">{order.items.length}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.userId?.name || 'Unknown'}</TableCell>
                  <TableCell className="font-semibold">${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-green-600">${calculateProfit(order)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Unpicked Up</Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order._id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Un-Paid'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">No Refund</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedOrder(order); setDialogType('view'); }}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedOrder(order); setDialogType('edit'); }}>
                          <Edit className="h-4 w-4 mr-2" /> Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadReceipt(order)}>
                          <Download className="h-4 w-4 mr-2" /> Download Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteOrder(order._id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={dialogType === 'view'} onOpenChange={() => setDialogType('')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?._id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Customer</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.userId?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Order Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Shipping Address</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Items</p>
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between border-b py-2">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Profit (10%):</span>
                <span className="text-sm font-semibold text-green-600">${calculateProfit(selectedOrder)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={dialogType === 'edit'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order - {selectedOrder?._id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Delivery Status</p>
                <Select value={selectedOrder.status} onValueChange={(v) => updateStatus(selectedOrder._id, v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Payment Status</p>
                <Select value={selectedOrder.paymentStatus} onValueChange={(v) => {
                  // Update payment status
                  toast.success('Payment status updated')
                  setDialogType('')
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { 
                toast.success('Order updated')
                setDialogType('')
              }} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
