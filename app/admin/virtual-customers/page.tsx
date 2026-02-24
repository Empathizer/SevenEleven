"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function VirtualCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [count, setCount] = useState(10)
  const [initialBalance, setInitialBalance] = useState(100)
  const [packageName, setPackageName] = useState("Basic")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/virtual-customers`, {
        credentials: 'include'
      })
      if (!res.ok) {
        setCustomers([])
        return
      }
      const data = await res.json()
      if (data.success) {
        setCustomers(data.data)
      }
    } catch (error) {
      setCustomers([])
    }
  }

  const generateCustomers = async () => {
    if (count < 1 || count > 200) {
      toast.error("Count must be between 1 and 200")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/virtual-customers/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ count, initialBalance, packageName })
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        toast.error(`Server error: ${res.status}`)
        setLoading(false)
        return
      }
      
      const data = await res.json()
      
      if (data.success) {
        toast.success(data.message)
        setOpen(false)
        loadCustomers()
      } else {
        toast.error(data.message || 'Failed to generate customers')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to server')
    }
    setLoading(false)
  }

  const loginAsCustomer = async (user: any) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/virtual-customers/login-as/${user._id}`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success(data.message)
        window.location.href = '/'
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to login as customer')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Virtual Customers</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Generate Virtual Customers</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Virtual Customers</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Count (1-200)</Label>
                <Input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value))} />
              </div>
              <div>
                <Label>Initial Balance</Label>
                <Input type="number" min={0} value={initialBalance} onChange={(e) => setInitialBalance(Number(e.target.value))} />
              </div>
              <div>
                <Label>Package Name</Label>
                <Input value={packageName} onChange={(e) => setPackageName(e.target.value)} />
              </div>
              <Button onClick={generateCustomers} disabled={loading} className="w-full">
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer: any) => (
            <TableRow key={customer._id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone || 'N/A'}</TableCell>
              <TableCell>{customer.package || 'N/A'}</TableCell>
              <TableCell>${customer.walletBalance || 0}</TableCell>
              <TableCell>
                <Badge variant="secondary">Virtual</Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => loginAsCustomer(customer)}>
                  Login As
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
