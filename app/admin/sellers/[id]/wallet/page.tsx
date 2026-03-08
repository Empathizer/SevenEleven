"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Minus, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminSellerWalletPage() {
  const params = useParams()
  const sellerId = params.id as string

  const [depositOpen, setDepositOpen] = useState(false)
  const [deductOpen, setDeductOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [seller, setSeller] = useState<any>(null)
  const [wallet, setWallet] = useState({ walletBalance: 0, totalEarnings: 0, totalWithdrawn: 0 })
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const userRes = await fetch(`${API_URL}/api/admin/users/${sellerId}`, { credentials: 'include' })

      if (userRes.ok) {
        const data = await userRes.json()
        if (data.success) {
          setSeller(data.user)
          setWallet({
            walletBalance: data.user.walletBalance || 0,
            totalEarnings: data.user.totalEarnings || 0,
            totalWithdrawn: data.user.totalWithdrawn || 0
          })
        }
      }

      const txnRes = await fetch(`${API_URL}/api/admin/sellers/${sellerId}/wallet/transactions`, { credentials: 'include' })
      if (txnRes.ok) {
        const data = await txnRes.json()
        if (data.success) setTransactions(data.transactions || [])
      }
    } catch (e) {
      console.error('Load error:', e)
    }
  }

  const handleDeposit = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error("Invalid amount")
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/sellers/${sellerId}/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: amt, note })
      })

      const data = await res.json()
      console.log('Deposit response:', data)

      if (res.ok && data.success) {
        toast.success(`$${amt.toFixed(2)} deposited`)
        setAmount("")
        setNote("")
        setDepositOpen(false)
        loadData()
      } else {
        toast.error(data.message || 'Failed to deposit')
      }
    } catch (e) {
      console.error('Deposit error:', e)
      toast.error('Failed to deposit')
    }
  }
  }

  const handleDeduct = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error("Invalid amount")
      return
    }
    if (amt > wallet.walletBalance) {
      toast.error("Insufficient balance")
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/sellers/${sellerId}/wallet/deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: amt, note })
      })

      const data = await res.json()
      
      if (res.ok) {
        toast.success(`$${amt.toFixed(2)} deducted`)
        setAmount("")
        setNote("")
        setDeductOpen(false)
        loadData()
      } else {
        toast.error(data.message || 'Failed to deduct amount')
      }
    } catch (e) {
      console.error('Deduct error:', e)
      toast.error('Failed to deduct amount')
    }
  }

  if (!seller) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading seller data...</p>
          <p className="text-xs text-muted-foreground mt-2">Seller ID: {sellerId}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/sellers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{seller.name} - Wallet</h1>
          <p className="text-sm text-muted-foreground">{seller.email}</p>
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
          <DialogTrigger asChild>
            <Button className="bg-chart-4 text-primary-foreground hover:bg-chart-4/90">
              <Plus className="mr-2 h-4 w-4" /> Add Deposit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Add Deposit</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Amount ($)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Note (Optional)</Label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Reason for deposit" className="bg-muted" rows={3} />
              </div>
              <Button onClick={handleDeposit} className="bg-chart-4 text-primary-foreground hover:bg-chart-4/90">Confirm Deposit</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={deductOpen} onOpenChange={setDeductOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Minus className="mr-2 h-4 w-4" /> Deduct Amount
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Deduct Amount</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Amount ($)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Note (Optional)</Label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Reason for deduction" className="bg-muted" rows={3} />
              </div>
              <Button onClick={handleDeduct} variant="destructive">Confirm Deduction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">${wallet.walletBalance.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-chart-4" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">${((seller.totalRecharge || 0) + (seller.recharge || 0)).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Recharge</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingDown className="h-8 w-8 text-chart-1" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">${((seller.totalWithdrawn || 0) + (seller.withdrawal || 0)).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Withdrawn</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((txn) => (
                <div key={txn._id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      txn.type === "deposit" || txn.type === "earning" ? "bg-chart-4/10" : "bg-chart-1/10"
                    }`}>
                      <DollarSign className={`h-5 w-5 ${
                        txn.type === "deposit" || txn.type === "earning" ? "text-chart-4" : "text-chart-1"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{txn.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(txn.createdAt).toLocaleString()} • By: {txn.createdBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${
                      txn.amount >= 0 ? "text-chart-4" : "text-chart-1"
                    }`}>
                      {txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
                    </span>
                    <Badge variant="secondary" className={
                      txn.type === "deposit" ? "bg-chart-4 text-primary-foreground" :
                      txn.type === "earning" ? "bg-chart-3 text-primary-foreground" :
                      txn.type === "withdrawal" ? "bg-chart-1 text-primary-foreground" :
                      "bg-muted text-muted-foreground"
                    }>
                      {txn.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
