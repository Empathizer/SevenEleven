"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 12

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [link, setLink] = useState("/products")
  const [currentPage, setCurrentPage] = useState(1)
  const [uploading, setUploading] = useState(false)

  const loadBanners = () => {
    fetch(`${API_URL}/api/admin/banners`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setBanners(data.banners || []))
  }

  useEffect(() => { loadBanners() }, [])

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
      
      const res = await fetch(`${API_URL}/api/admin/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, subtitle, image: imageUrl, link, isActive: true })
      })
      
      if (res.ok) {
        setTitle(""); setSubtitle(""); setImage(""); setImageFile(null); setImagePreview(""); setLink("/products")
        setOpen(false)
        loadBanners()
        toast.success("Banner added")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Failed to add banner')
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'An error occurred')
    }
    setUploading(false)
  }

  const toggleActive = async (id: string, active: boolean) => {
    const res = await fetch(`${API_URL}/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: active })
    })
    if (res.ok) {
      loadBanners()
      toast.success(active ? "Banner activated" : "Banner deactivated")
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`${API_URL}/api/admin/banners/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (res.ok) {
      loadBanners()
      toast.success("Banner deleted")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">Control homepage hero slider banners.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Add Banner</Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader><DialogTitle className="text-foreground">Add Banner</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} required className="bg-muted" /></div>
              <div className="flex flex-col gap-2"><Label>Subtitle</Label><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="bg-muted" /></div>
              <div className="flex flex-col gap-2">
                <Label>Banner Image</Label>
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
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>
              <div className="flex flex-col gap-2"><Label>Link</Label><Input value={link} onChange={e => setLink(e.target.value)} className="bg-muted" /></div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={uploading}>
                {uploading ? "Uploading..." : "Add Banner"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((banner) => (
          <div key={banner._id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-[3/1]">
              <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-foreground">{banner.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{banner.subtitle}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={banner.isActive} onCheckedChange={(v) => toggleActive(banner._id, v)} />
                  <span className="text-xs text-muted-foreground">{banner.isActive ? "Active" : "Inactive"}</span>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(banner._id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(banners.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
