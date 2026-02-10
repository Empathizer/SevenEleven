"use client"

import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export default function CartPage() {
  const { getCartProducts, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const cartProducts = getCartProducts()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart ({totalItems} items)</h1>

          {cartProducts.length === 0 ? (
            <div className="mt-12 flex flex-col items-center text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add some products to get started</p>
              <Link href="/products">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-4">
                  {cartProducts.map(({ productId, quantity, product }) => {
                    if (!product) return null
                    return (
                      <div key={productId} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                        <Link href={`/products/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                          <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <Link href={`/products/${product.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">{product.sellerName}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-border">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(productId, quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{quantity}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(productId, quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-primary">${(product.price * quantity).toFixed(2)}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(productId)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-chart-4">{totalPrice >= 50 ? "Free" : "$4.99"}</span>
                    </div>
                    <div className="my-2 border-t border-border" />
                    <div className="flex justify-between text-base font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">${(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}</span>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <Link href="/checkout">
                      <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Proceed to Checkout</Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Login to Checkout</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
