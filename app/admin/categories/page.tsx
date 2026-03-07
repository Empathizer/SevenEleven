"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 20

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [uploading, setUploading] = useState(false)

  const loadCategories = () => {
    fetch(`${API_URL}/api/admin/categories?t=${Date.now()}`, { 
      credentials: "include",
      cache: 'no-store'
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => setCategories(data.categories || []))
      .catch(err => {
        console.error('Load categories error:', err)
        toast.error('Failed to load categories')
      })
  }

  useEffect(() => { loadCategories() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageFile) {
      toast.error('Please select an image')
      return
    }
    
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('images', imageFile)
      
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        toast.error(errorData.message || 'Failed to upload image')
        setUploading(false)
        return
      }
      
      const uploadData = await uploadRes.json()
      const imageUrl = uploadData.urls?.[0]
      
      if (!imageUrl) {
        toast.error('No image URL returned')
        setUploading(false)
        return
      }
      
      const res = await fetch(`${API_URL}/api/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), image: imageUrl })
      })
      
      if (res.ok) {
        setName(""); setSlug(""); setImage(""); setImageFile(null); setImagePreview("")
        setOpen(false)
        loadCategories()
        toast.success("Category added")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Failed to add category')
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'An error occurred')
    }
    setUploading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: 'no-store'
      })
      
      if (res.ok) {
        // Immediately update local state
        setCategories(prev => prev.filter(cat => cat._id !== id))
        toast.success("Category deleted")
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to delete category')
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error('Failed to delete category')
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
              <div className="flex flex-col gap-2">
                <Label>Category Image</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                      setImagePreview(URL.createObjectURL(file))
                    }
                  }} 
                  className="bg-muted" 
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg mt-2" />
                )}
              </div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={uploading}>
                {uploading ? "Uploading..." : "Add Category"}
              </Button>
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
            {categories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((cat) => (
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

      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(categories.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
