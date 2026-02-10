"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const store = getStore()
  const [, setRefresh] = useState(0)
  const users = store.getUsers()

  const handleDelete = (id: string) => {
    if (id === "user-admin") { toast("Cannot delete admin"); return }
    store.deleteUser(id)
    setRefresh(v => v + 1)
    toast("User deleted")
  }

  const roleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-accent text-accent-foreground"
      case "seller": return "bg-chart-1 text-primary-foreground"
      default: return "bg-chart-4 text-primary-foreground"
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">All Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage all registered users on the platform.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell><Badge className={roleColor(user.role)}>{user.role}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)} disabled={user.id === "user-admin"}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
