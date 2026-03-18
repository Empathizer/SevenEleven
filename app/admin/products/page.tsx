"use client"

import { useState, useEffect } from "react"
import { Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const ITEMS_PER_PAGE = 20

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [virtualSellers, setVirtualSellers] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'admin' | 'seller'>('seller')
  const [currentPage, setCurrentPage] = useState(1)

  const loadProducts = () => {
    fetch(`${API_URL}/api/admin/products`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setProducts(data.data || []))
      .catch(e => console.error('Load error:', e))
  }

  useEffect(() => { 
    loadProducts()
    fetch(`${API_URL}/api/admin/categories`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
      .catch(e => console.error('Failed to load categories:', e))
    
    fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const virtuals = data.data.filter((s: any) => s.userId?.isVirtual === true)
          setVirtualSellers(virtuals)
        }
      })
      .catch(e => console.error('Failed to load sellers:', e))
  }, [])

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected')
      return
    }
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return
    
    try {
      for (const id of selectedProducts) {
        await fetch(`${API_URL}/api/admin/products/${id}`, {
          method: "DELETE",
          credentials: "include"
        })
      }
      toast.success(`Deleted ${selectedProducts.length} products`)
      setSelectedProducts([])
      loadProducts()
    } catch (e) {
      toast.error("Failed to delete products")
    }
  }

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

  const filteredProducts = products.filter(p => {
    if (filter === 'admin') return !p.sellerId
    if (filter === 'seller') return p.sellerId
    return true
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Seller products that show on home page.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const res = await fetch(`${API_URL}/api/admin/assign-virtual-seller`, {
                  method: 'POST',
                  credentials: 'include'
                })
                const data = await res.json()
                if (data.success) {
                  toast.success(data.message)
                  loadProducts()
                } else {
                  toast.error(data.message)
                }
              } catch (e) {
                toast.error('Failed to assign virtual seller')
              }
            }}
          >
            Show Admin Products on Homepage
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const res = await fetch(`${API_URL}/api/admin/fix-products`, {
                  method: 'POST',
                  credentials: 'include'
                })
                const data = await res.json()
                if (res.ok) {
                  toast.success(data.message)
                  loadProducts()
                } else {
                  toast.error(data.message)
                }
              } catch (e) {
                toast.error('Failed to fix products')
              }
            }}
          >
            Fix Buying Prices
          </Button>
          {selectedProducts.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedProducts.length} Selected
            </Button>
          )}
          <Link href="/admin/products/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button 
          size="sm" 
          variant={filter === 'admin' ? 'default' : 'outline'}
          onClick={() => setFilter('admin')}
        >
          Admin Products ({products.filter(p => !p.sellerId).length})
        </Button>
        <Button 
          size="sm" 
          variant={filter === 'seller' ? 'default' : 'outline'}
          onClick={() => setFilter('seller')}
        >
          Seller Products ({products.filter(p => p.sellerId).length})
        </Button>
        <Button 
          size="sm" 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Products ({products.length})
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <input 
                  type="checkbox" 
                  checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(paginatedProducts.map(p => p._id))
                    } else {
                      setSelectedProducts([])
                    }
                  }}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Buying Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Profit (10%)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product._id])
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product._id))
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </TableCell>
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
                  <TableCell>
                    {product.sellerId ? (
                      <Badge variant="secondary">Seller</Badge>
                    ) : (
                      <Badge variant="default">Catalogue</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.sellerId?.storeName || product.sellerId?.name || 'Admin'}</TableCell>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={product.featured || false}
                      onChange={async (e) => {
                        try {
                          const res = await fetch(`${API_URL}/api/admin/products/${product._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ featured: e.target.checked })
                          })
                          if (res.ok) {
                            toast.success(e.target.checked ? 'Product featured' : 'Product unfeatured')
                            loadProducts()
                          }
                        } catch (err) {
                          toast.error('Failed to update')
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </TableCell>
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
