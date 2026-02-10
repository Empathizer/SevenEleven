"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function AdminSellersPage() {
  const store = getStore()
  const [, setRefresh] = useState(0)
  const sellers = store.getUsers().filter(u => u.role === "seller")

  const handleApprove = (id: string) => {
    store.approveSeller(id)
    setRefresh(v => v + 1)
    toast("Seller approved")
  }

  const handleReject = (id: string) => {
    store.rejectSeller(id)
    setRefresh(v => v + 1)
    toast("Seller rejected")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Manage Sellers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Approve, reject, or manage seller accounts.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Store Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium text-foreground">{seller.storeName || seller.name}</TableCell>
                <TableCell className="text-muted-foreground">{seller.email}</TableCell>
                <TableCell>
                  <Badge className={
                    seller.sellerStatus === "approved" ? "bg-chart-4 text-primary-foreground" :
                    seller.sellerStatus === "rejected" ? "bg-destructive text-destructive-foreground" :
                    "bg-chart-3 text-primary-foreground"
                  }>
                    {seller.sellerStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(seller.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {seller.sellerStatus === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => handleApprove(seller.id)} className="bg-chart-4 text-primary-foreground hover:bg-chart-4/90">
                        <Check className="mr-1 h-3 w-3" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(seller.id)}>
                        <X className="mr-1 h-3 w-3" /> Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
