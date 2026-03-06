"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 20

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const loadUsers = () => {
    fetch(`${API_URL}/api/admin/users`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (!data.success) {
          toast.error(data.message || 'Failed to load users')
          return
        }
        setUsers(data.data || [])
      })
      .catch(e => {
        console.error('Load error:', e)
        toast.error('Failed to load users')
      })
  }

  useEffect(() => { loadUsers() }, [])

  const handleDelete = async (id: string, email: string) => {
    if (email.includes("admin@")) { toast.error("Cannot delete admin"); return }
    if (!confirm('Permanently delete this user? This action cannot be undone.')) return
    const res = await fetch(`${API_URL}/api/admin/users/${id}/delete`, {
      method: "DELETE",
      credentials: "include"
    })
    if (res.ok) {
      loadUsers()
      toast.success("User deleted permanently")
    } else {
      toast.error("Failed to delete user")
    }
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
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell><Badge className={roleColor(user.role)}>{user.role}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : user.status === 'blocked' ? 'destructive' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id, user.email)} disabled={user.email.includes("admin@")}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
