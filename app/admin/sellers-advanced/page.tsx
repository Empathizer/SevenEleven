"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdvancedSellersPage() {
  const [sellers, setSellers] = useState([])
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

  const handleAction = async (endpoint: string, body: any) => {
    try {
      const res = await fetch(`/api/admin/sellers/${selectedSeller._id}/${endpoint}`, {
        method: endpoint === 'message' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Action completed")
        fetchSellers()
        setDialogType("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Action failed")
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
      toast.error("Failed to adjust balance")
    }
  }

  const openDialog = (seller: any, type: string) => {
    setSelectedSeller(seller)
    setDialogType(type)
    setFormData({})
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Advanced Seller Management</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Pending</TableHead>
            <TableHead>Guarantee</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Salesman</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.map((seller: any) => (
            <TableRow key={seller._id}>
              <TableCell>{seller.storeName}</TableCell>
              <TableCell>${seller.walletBalance || 0}</TableCell>
              <TableCell>${seller.pendingBalance || 0}</TableCell>
              <TableCell>${seller.guaranteeMoney || 0}</TableCell>
              <TableCell>{seller.package || 'N/A'}</TableCell>
              <TableCell>{seller.salesman || 'N/A'}</TableCell>
              <TableCell>{seller.viewsBase || 0} / {seller.viewsInc || 0}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'package')}>Package</Button>
                  <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'salesman')}>Salesman</Button>
                  <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'views')}>Views</Button>
                  <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'guarantee')}>Guarantee</Button>
                  <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'balance')}>Balance</Button>
                  <Button size="sm" variant="outline" onClick={() => openDialog(seller, 'message')}>Message</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!dialogType} onOpenChange={() => setDialogType("")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'package' && 'Set Package'}
              {dialogType === 'salesman' && 'Set Salesman'}
              {dialogType === 'views' && 'Set Views'}
              {dialogType === 'guarantee' && 'Set Guarantee Money'}
              {dialogType === 'balance' && 'Adjust Balance'}
              {dialogType === 'message' && 'Send Message'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {dialogType === 'package' && (
              <>
                <div>
                  <Label>Package Name</Label>
                  <Input value={formData.packageName || ''} onChange={(e) => setFormData({...formData, packageName: e.target.value})} />
                </div>
                <Button onClick={() => handleAction('package', { packageName: formData.packageName })}>Save</Button>
              </>
            )}
            {dialogType === 'salesman' && (
              <>
                <div>
                  <Label>Salesman Name</Label>
                  <Input value={formData.salesman || ''} onChange={(e) => setFormData({...formData, salesman: e.target.value})} />
                </div>
                <Button onClick={() => handleAction('salesman', { salesman: formData.salesman })}>Save</Button>
              </>
            )}
            {dialogType === 'views' && (
              <>
                <div>
                  <Label>Base Views</Label>
                  <Input type="number" value={formData.viewsBase || 0} onChange={(e) => setFormData({...formData, viewsBase: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Increment Views</Label>
                  <Input type="number" value={formData.viewsInc || 0} onChange={(e) => setFormData({...formData, viewsInc: Number(e.target.value)})} />
                </div>
                <Button onClick={() => handleAction('views', { viewsBase: formData.viewsBase, viewsInc: formData.viewsInc })}>Save</Button>
              </>
            )}
            {dialogType === 'guarantee' && (
              <>
                <div>
                  <Label>Guarantee Money</Label>
                  <Input type="number" value={formData.guaranteeMoney || 0} onChange={(e) => setFormData({...formData, guaranteeMoney: Number(e.target.value)})} />
                </div>
                <Button onClick={() => handleAction('guarantee', { guaranteeMoney: formData.guaranteeMoney })}>Save</Button>
              </>
            )}
            {dialogType === 'balance' && (
              <>
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
              </>
            )}
            {dialogType === 'message' && (
              <>
                <div>
                  <Label>Message</Label>
                  <Textarea value={formData.message || ''} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} />
                </div>
                <Button onClick={() => handleAction('message', { message: formData.message })}>Send</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
