"use client"

import React from "react"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function AdminBannersPage() {
  const store = getStore()
  const [, setRefresh] = useState(0)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [image, setImage] = useState("")
  const [link, setLink] = useState("/products")
  const banners = store.getBanners()

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    store.addBanner({ title, subtitle, image, link, active: true })
    setTitle(""); setSubtitle(""); setImage(""); setLink("/products")
    setOpen(false)
    setRefresh(v => v + 1)
    toast("Banner added")
  }

  const toggleActive = (id: string, active: boolean) => {
    store.updateBanner(id, { active })
    setRefresh(v => v + 1)
    toast(active ? "Banner activated" : "Banner deactivated")
  }

  const handleDelete = (id: string) => {
    store.deleteBanner(id)
    setRefresh(v => v + 1)
    toast("Banner deleted")
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
              <div className="flex flex-col gap-2"><Label>Image URL</Label><Input value={image} onChange={e => setImage(e.target.value)} required className="bg-muted" /></div>
              <div className="flex flex-col gap-2"><Label>Link</Label><Input value={link} onChange={e => setLink(e.target.value)} className="bg-muted" /></div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Banner</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <div key={banner.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-[3/1]">
              <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-foreground">{banner.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{banner.subtitle}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={banner.active} onCheckedChange={(v) => toggleActive(banner.id, v)} />
                  <span className="text-xs text-muted-foreground">{banner.active ? "Active" : "Inactive"}</span>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
