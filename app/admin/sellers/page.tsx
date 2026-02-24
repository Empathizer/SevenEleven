"use client"

import { useState, useEffect } from "react"
import { Check, X, Wallet, Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([])
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [dialogType, setDialogType] = useState("")
  const [formData, setFormData] = useState<any>({})

  const fetchSellers = async () => {
    try {
      const res = await fetch('/api/admin/sellers', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSellers(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sellers/${id}/approve`, {
        method: 'PUT',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Seller approved!')
        fetchSellers()
      }
    } catch (error) {
      toast.error('Failed to approve')
    }
  }

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sellers/${id}/reject`, {
        method: 'PUT',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Seller rejected')
        fetchSellers()
      }
    } catch (error) {
      toast.error('Failed to reject')
    }
  }

  const handleAdvancedAction = async (endpoint: string, body: any) => {
    try {
      const res = await fetch(`/api/admin/sellers/${selectedSeller._id}/${endpoint}`, {
        method: endpoint === 'message' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Action completed')
        fetchSellers()
        setDialogType("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Action failed')
    }
  }

  const adjustBalance = async (type: string) => {
    try {
      const res = await fetch(`/api/admin/sellers/${selectedSeller._id}/balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          amount: Number(formData.amount), 
          type, 
          note: formData.note 
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Balance ${type}ed`)
        fetchSellers()
        setDialogType("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to adjust balance')
    }
  }

  const openDialog = (seller: any, type: string) => {
    setSelectedSeller(seller)
    setDialogType(type)
    setFormData({})
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
              <TableHead>Wallet</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller._id}>
                <TableCell className="font-medium">{seller.storeName}</TableCell>
                <TableCell className="text-muted-foreground">{seller.userId?.email}</TableCell>
                <TableCell className="font-semibold">${seller.walletBalance || 0}</TableCell>
                <TableCell>${seller.pendingBalance || 0}</TableCell>
                <TableCell>{seller.package || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={seller.status === 'approved' ? 'default' : seller.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {seller.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 flex-wrap">
                    {seller.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(seller._id)}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(seller._id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'advanced')}>
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogType === 'advanced'} onOpenChange={() => setDialogType("")}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Seller - {selectedSeller?.storeName}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="balance">Balance</TabsTrigger>
              <TabsTrigger value="message">Message</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Wallet Balance</Label>
                  <p className="text-2xl font-bold">${selectedSeller?.walletBalance || 0}</p>
                </div>
                <div>
                  <Label>Pending Balance</Label>
                  <p className="text-2xl font-bold">${selectedSeller?.pendingBalance || 0}</p>
                </div>
                <div>
                  <Label>Guarantee Money</Label>
                  <p>${selectedSeller?.guaranteeMoney || 0}</p>
                </div>
                <div>
                  <Label>Credit Score</Label>
                  <p>{selectedSeller?.creditScore || 100}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label>Package</Label>
                <Input value={formData.packageName || selectedSeller?.package || ''} onChange={(e) => setFormData({...formData, packageName: e.target.value})} />
                <Button size="sm" className="mt-2" onClick={() => handleAdvancedAction('package', { packageName: formData.packageName })}>Save</Button>
              </div>
              <div>
                <Label>Salesman</Label>
                <Input value={formData.salesman || selectedSeller?.salesman || ''} onChange={(e) => setFormData({...formData, salesman: e.target.value})} />
                <Button size="sm" className="mt-2" onClick={() => handleAdvancedAction('salesman', { salesman: formData.salesman })}>Save</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Views</Label>
                  <Input type="number" value={formData.viewsBase || selectedSeller?.viewsBase || 0} onChange={(e) => setFormData({...formData, viewsBase: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Inc Views</Label>
                  <Input type="number" value={formData.viewsInc || selectedSeller?.viewsInc || 0} onChange={(e) => setFormData({...formData, viewsInc: Number(e.target.value)})} />
                </div>
              </div>
              <Button size="sm" onClick={() => handleAdvancedAction('views', { viewsBase: formData.viewsBase, viewsInc: formData.viewsInc })}>Save Views</Button>
            </TabsContent>
            <TabsContent value="balance" className="space-y-4">
              <div>
                <Label>Amount</Label>
                <Input type="number" value={formData.amount || 0} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div>
                <Label>Note</Label>
                <Input value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => adjustBalance('deposit')} className="flex-1">Deposit</Button>
                <Button onClick={() => adjustBalance('deduct')} variant="destructive" className="flex-1">Deduct</Button>
              </div>
            </TabsContent>
            <TabsContent value="message" className="space-y-4">
              <div>
                <Label>Message</Label>
                <Textarea value={formData.message || ''} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} />
              </div>
              <Button onClick={() => handleAdvancedAction('message', { message: formData.message })}>Send</Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
