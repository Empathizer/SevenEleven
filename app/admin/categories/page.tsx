"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [image, setImage] = useState("")
  const [open, setOpen] = useState(false)

  const loadCategories = () => {
    fetch("http://localhost:5000/api/admin/categories", { credentials: "include" })
      .then(r => r.json())
      .then(data => setCategories(data.data || []))
  }

  useEffect(() => { loadCategories() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("http://localhost:5000/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), image: image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop" })
    })
    if (res.ok) {
      setName(""); setSlug(""); setImage("")
      setOpen(false)
      loadCategories()
      toast("Category added")
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (res.ok) {
      loadCategories()
      toast("Category deleted")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, or remove product categories.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader><DialogTitle className="text-foreground">Add Category</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" required className="bg-muted" /></div>
              <div className="flex flex-col gap-2"><Label>Slug</Label><Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="category-slug" className="bg-muted" /></div>
              <div className="flex flex-col gap-2"><Label>Image URL</Label><Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="bg-muted" /></div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Category</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={cat.image || "/placeholder.svg"} alt={cat.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="text-muted-foreground">-</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(cat._id)}>
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
