"use client"

import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SellerWalletPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== "seller") {
      router.push("/login")
      return
    }
    fetch("http://localhost:5000/api/seller/wallet", { credentials: "include" })
      .then(r => r.json())
      .then(data => setWallet(data.data))
    fetch("http://localhost:5000/api/seller/transactions", { credentials: "include" })
      .then(r => r.json())
      .then(data => setTransactions(data.data || []))
  }, [user, router])

  if (!user || user.role !== "seller" || !wallet) return null

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your earnings and balance</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
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
    </div>
  )
}
