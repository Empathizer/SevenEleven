"use client"

import { useState } from "react"
import { Check, X, Wallet, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getStore } from "@/lib/store"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminSellersPage() {
  const store = getStore()
  const [, setRefresh] = useState(0)
  const sellers = store.getUsers().filter(u => u.role === "seller")

  const handleApprove = (id: string) => {
    const seller = store.getUserById(id)
    store.approveSeller(id)
    setRefresh(v => v + 1)
    toast.success(`Seller approved! Email sent to ${seller?.email}`)
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
              <TableHead>Wallet Balance</TableHead>
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
                <TableCell className="font-semibold text-primary">${(seller.walletBalance || 0).toFixed(2)}</TableCell>
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
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 h-3 w-3" /> View KYC
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-card">
                        <DialogHeader>
                          <DialogTitle>Seller KYC Details - {seller.storeName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Full Name</p>
                              <p className="text-sm text-muted-foreground">{seller.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Email</p>
                              <p className="text-sm text-muted-foreground">{seller.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Store Name</p>
                              <p className="text-sm text-muted-foreground">{seller.storeName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Status</p>
                              <Badge className={
                                seller.sellerStatus === "approved" ? "bg-chart-4 text-primary-foreground" :
                                seller.sellerStatus === "rejected" ? "bg-destructive text-destructive-foreground" :
                                "bg-chart-3 text-primary-foreground"
                              }>
                                {seller.sellerStatus}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Store Description</p>
                            <p className="text-sm text-muted-foreground">{seller.storeDescription || 'N/A'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">ID Type</p>
                              <p className="text-sm text-muted-foreground">{seller.idType || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">ID Number</p>
                              <p className="text-sm text-muted-foreground">{seller.idNumber || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-2">ID Image</p>
                            {seller.idImage ? (
                              seller.idImage.startsWith('data:image') ? (
                                <img src={seller.idImage} alt="ID" className="w-full max-h-64 object-contain rounded-lg border border-border bg-muted" />
                              ) : (
                                <div className="rounded-lg border border-border bg-muted p-8 text-center">
                                  <p className="text-sm text-muted-foreground mb-2">Image URL provided (not uploaded)</p>
                                  <a href={seller.idImage} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    View Image
                                  </a>
                                </div>
                              )
                            ) : (
                              <div className="rounded-lg border border-dashed border-border bg-muted p-8 text-center">
                                <p className="text-sm text-muted-foreground">No image uploaded</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Residence Address</p>
                            <p className="text-sm text-muted-foreground">{seller.address || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Invitation Code</p>
                            <p className="text-sm text-muted-foreground">{seller.invitationCode || 'None'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Joined Date</p>
                              <p className="text-sm text-muted-foreground">{new Date(seller.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Wallet Balance</p>
                              <p className="text-sm font-semibold text-primary">${(seller.walletBalance || 0).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {seller.sellerStatus === "approved" && (
                      <Link href={`/admin/sellers/${seller.id}/wallet`}>
                        <Button size="sm" variant="outline">
                          <Wallet className="mr-1 h-3 w-3" /> Wallet
                        </Button>
                      </Link>
                    )}
                    {seller.sellerStatus === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(seller.id)} className="bg-chart-4 text-primary-foreground hover:bg-chart-4/90">
                          <Check className="mr-1 h-3 w-3" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(seller.id)}>
                          <X className="mr-1 h-3 w-3" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
