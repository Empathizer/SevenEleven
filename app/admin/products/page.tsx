"use client"

import { useState } from "react"
import { Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStore } from "@/lib/store"
import { toast } from "sonner"

export default function AdminProductsPage() {
  const store = getStore()
  const [, setRefresh] = useState(0)
  const products = store.getProducts()

  const handleDelete = (id: string) => {
    store.deleteProduct(id)
    setRefresh(v => v + 1)
    toast("Product deleted")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">View and manage all products on the platform.</p>

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
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                    <span className="max-w-[200px] truncate font-medium text-foreground">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                <TableCell className="font-medium text-primary">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground">{product.stock}</TableCell>
                <TableCell className="text-muted-foreground">{product.sellerName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" variant="outline"><Eye className="mr-1 h-3 w-3" /> View</Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
