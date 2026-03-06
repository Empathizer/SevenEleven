"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 20

export default function WithdrawalsPage() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [adminNote, setAdminNote] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/withdrawals`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setRequests(data.withdrawals || [])
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const processRequest = async (requestId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/withdrawals/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, adminNote })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Request ${status}`)
        fetchRequests()
        setSelectedRequest(null)
        setAdminNote("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to process request")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seller</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((request: any) => (
            <TableRow key={request._id}>
              <TableCell>{request.sellerName || 'N/A'}</TableCell>
              <TableCell>${request.amount}</TableCell>
              <TableCell>
                <Badge variant={
                  request.status === 'approved' ? 'default' : 
                  request.status === 'rejected' ? 'destructive' : 
                  'secondary'
                }>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <Button size="sm" onClick={() => setSelectedRequest(request)}>
                    Process
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(requests.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Withdrawal Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Seller: {selectedRequest.sellerId?.storeName}</p>
                <p className="text-sm text-muted-foreground">Amount: ${selectedRequest.amount}</p>
              </div>
              <div>
                <Label>Admin Note</Label>
                <Input value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Optional note" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => processRequest(selectedRequest._id, 'approved')} className="flex-1">
                  Approve
                </Button>
                <Button onClick={() => processRequest(selectedRequest._id, 'rejected')} variant="destructive" className="flex-1">
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
