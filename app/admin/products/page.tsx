"use client"

import { useState, useEffect } from "react"
import { Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  const loadProducts = () => {
    fetch(`${API_URL}/api/admin/products`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setProducts(data.data || []))
      .catch(e => console.error('Load error:', e))
  }

  useEffect(() => { loadProducts() }, [])

  const handleDelete = async (id: string) => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (res.ok) {
      toast.success("Product deleted")
      loadProducts()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">View and manage all products on the platform.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add Product</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                      <span className="max-w-[200px] truncate font-medium text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.categoryId?.name || 'N/A'}</TableCell>
                  <TableCell className="font-medium text-primary">${product.price?.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{product.stock}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sellerId?.storeName || product.sellerId?.name || 'N/A'}</TableCell>
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
    </div>
  )
}
