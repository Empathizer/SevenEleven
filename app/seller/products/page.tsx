"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Trash2, Pencil, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function SellerProductsPage() {
  const { user } = useAuth()
  const store = getStore()
  const [, setRefresh] = useState(0)

  if (!user) return null
  const products = store.getProducts({ sellerId: user.id })

  const handleDelete = (id: string) => {
    store.deleteProduct(id)
    setRefresh(v => v + 1)
    toast("Product deleted")
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} products in your store.</p>
        </div>
        <Link href="/seller/products/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Add Product</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                    <div>
                      <p className="max-w-[200px] truncate font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-primary">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={product.stock > 10 ? "bg-chart-4 text-primary-foreground" : product.stock > 0 ? "bg-chart-3 text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.sold}</TableCell>
                <TableCell className="text-muted-foreground">{product.rating}/5</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" variant="outline"><Eye className="h-3 w-3" /></Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No products yet. <Link href="/seller/products/new" className="text-primary hover:underline">Add your first product</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
