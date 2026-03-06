"use client"

import { useState, useEffect } from "react"
import { Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 20

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const loadProducts = () => {
    fetch(`${API_URL}/api/products?adminOnly=true`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setProducts((data.data || data.products || []).filter((p: any) => !p.sellerId)))
      .catch(e => console.error('Load error:', e))
  }

  useEffect(() => { loadProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
      
      if (res.ok) {
        toast.success("Product deleted")
        loadProducts()
      } else {
        const data = await res.json()
        toast.error(data.message || "Failed to delete product")
      }
    } catch (e) {
      toast.error("Failed to delete product")
      console.error('Delete error:', e)
    }
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Products (Virtual)</h1>
          <p className="mt-1 text-sm text-muted-foreground">Catalogue products for sellers. Not shown on home page.</p>
        </div>
        <Button 
          onClick={async () => {
            const categories = await fetch(`${API_URL}/api/admin/categories`, { credentials: 'include' })
              .then(r => r.json())
              .then(data => data.categories || [])
            
            if (categories.length === 0) {
              toast.error('Please create a category first')
              return
            }
            
            try {
              const res = await fetch(`${API_URL}/api/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  name: `Admin Product ${Date.now()}`,
                  description: `Unique admin product created at ${new Date().toISOString()}`,
                  price: Math.floor(Math.random() * 200) + 20,
                  buyingPrice: 0,
                  categoryId: categories[0]._id,
                  sellerId: null,
                  stock: Math.floor(Math.random() * 200) + 50,
                  images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop']
                })
              })
              if (res.ok) {
                toast.success('Admin product added')
                loadProducts()
              } else {
                toast.error('Failed to add product')
              }
            } catch (e) {
              toast.error('Failed to add product')
            }
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add Unique Admin Product
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Buying Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Profit (10%)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No virtual products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                      <span className="max-w-[200px] truncate font-medium text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.categoryId?.name || 'N/A'}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">${(product.buyingPrice || 0).toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-primary">${product.price?.toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-chart-4">${((product.price || 0) - (product.buyingPrice || 0)).toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${product._id}`}>
                        <Button size="sm" variant="outline"><Eye className="mr-1 h-3 w-3" /> View</Button>
                      </Link>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
