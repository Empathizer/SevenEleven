"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Minus, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminSellerWalletPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const store = getStore()
  const sellerId = params.id as string

  const [depositOpen, setDepositOpen] = useState(false)
  const [deductOpen, setDeductOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [, setRefresh] = useState(0)

  const seller = store.getUserById(sellerId)
  const wallet = store.getSellerWallet(sellerId)
  const transactions = store.getTransactions(sellerId)

  if (!seller || seller.role !== "seller" || !wallet) {
    return <div className="text-muted-foreground">Seller not found</div>
  }

  const handleDeposit = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error("Invalid amount")
      return
    }
    if (!note.trim()) {
      toast.error("Note is required")
      return
    }
    store.addDeposit(sellerId, amt, note, user?.id || "admin")
    toast.success(`$${amt.toFixed(2)} deposited to ${seller.storeName}`)
    setAmount("")
    setNote("")
    setDepositOpen(false)
    setRefresh(v => v + 1)
  }

  const handleDeduct = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error("Invalid amount")
      return
    }
    if (amt > wallet.walletBalance) {
      toast.error("Insufficient balance")
      return
    }
    if (!note.trim()) {
      toast.error("Note is required")
      return
    }
    store.deductAmount(sellerId, amt, note, user?.id || "admin")
    toast.success(`$${amt.toFixed(2)} deducted from ${seller.storeName}`)
    setAmount("")
    setNote("")
    setDeductOpen(false)
    setRefresh(v => v + 1)
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
          <h1 className="text-2xl font-bold text-foreground">{seller.storeName} - Wallet</h1>
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
                <Label>Note</Label>
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
                <Label>Note</Label>
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
            <p className="mt-4 text-3xl font-bold text-foreground">${wallet.totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingDown className="h-8 w-8 text-chart-1" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">${wallet.totalWithdrawn.toFixed(2)}</p>
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
                <div key={txn.id} className="flex items-center justify-between rounded-lg border border-border p-4">
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
