"use client"

import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function SellerWalletPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "seller") {
      router.push("/login")
      return
    }
    fetch(`${API_URL}/api/seller/wallet`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setWallet(data.data))
    fetch(`${API_URL}/api/seller/transactions`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setTransactions(data.data || []))
    fetch(`${API_URL}/api/seller/withdrawals`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setWithdrawals(data.withdrawals || []))
  }, [user, router])

  if (!user || user.role !== "seller" || !wallet) return null

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error("Invalid amount")
      return
    }
    if (amt > wallet.walletBalance) {
      toast.error("Insufficient balance")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/seller/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: amt })
      })

      if (res.ok) {
        toast.success("Withdrawal request submitted")
        setAmount("")
        setDialogOpen(false)
        window.location.reload()
      } else {
        toast.error("Failed to submit request")
      }
    } catch (e) {
      toast.error("Failed to submit request")
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your earnings and balance</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Request Withdrawal</Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
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
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">${(wallet.pendingBalance || 0).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Pending Balance</p>
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
            <p className="mt-4 text-3xl font-bold text-foreground">${(wallet.totalWithdrawn || 0).toFixed(2)}</p>
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
                      <p className="text-xs text-muted-foreground">{new Date(txn.createdAt).toLocaleString()}</p>
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
                      txn.type === "deduction" ? "bg-destructive text-destructive-foreground" :
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

      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No withdrawal requests</p>
          ) : (
            <div className="flex flex-col gap-3">
              {withdrawals.map((w) => (
                <div key={w._id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">${w.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(w.createdAt).toLocaleString()}</p>
                  </div>
                  <Badge variant={w.status === 'approved' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {w.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div>
              <Label>Amount</Label>
              <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Available: ${wallet?.walletBalance.toFixed(2)}</p>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
