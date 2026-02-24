"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function VirtualCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(10)
  const [initialBalance, setInitialBalance] = useState(100)
  const [packageName, setPackageName] = useState("Basic")

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/virtual-customers', {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setCustomers(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const generateCustomers = async () => {
    if (count < 1 || count > 200) {
      toast.error("Count must be between 1 and 200")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/virtual-customers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ count, initialBalance, packageName })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        fetchCustomers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to generate customers")
    } finally {
      setLoading(false)
    }
  }

  const loginAsCustomer = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/virtual-customers/login-as/${id}`, {
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
      toast.error("Failed to login as customer")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Virtual Customers</h1>
        <Dialog>
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
              <TableCell>${customer.walletBalance}</TableCell>
              <TableCell>
                <Badge variant={customer.isVirtual ? "secondary" : "default"}>
                  {customer.isVirtual ? "Virtual" : "Real"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => loginAsCustomer(customer._id)}>
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
