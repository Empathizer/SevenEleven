"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CreditCard, Truck, ShieldCheck, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function CheckoutPage() {
  const { user } = useAuth()
  const { getCartProducts, totalItems, clearCart } = useCart()
  const router = useRouter()
  const cartProducts = getCartProducts()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    const fetchProducts = async () => {
      if (cartProducts.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        const productIds = cartProducts.map(cp => cp.productId)
        const res = await fetch(`${API_URL}/api/products`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            const dbProducts = data.products || []
            const merged = cartProducts.map(cp => {
              const dbProd = dbProducts.find((p: any) => p._id === cp.productId)
              if (dbProd) {
                return {
                  productId: cp.productId,
                  quantity: cp.quantity,
                  product: {
                    id: dbProd._id,
                    name: dbProd.name,
                    price: dbProd.price,
                    images: dbProd.images || [],
                    sellerId: dbProd.sellerId?._id || dbProd.sellerId
                  }
                }
              }
              return null
            }).filter(Boolean)
            setProducts(merged)
          }
        }
      } catch (e) {
        console.error('Failed to fetch products:', e)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [cartProducts])

  const totalPrice = products.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)
  const shipping = totalPrice >= 50 ? 0 : 4.99
  const total = totalPrice + shipping

  if (!user) return null

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    const orderItems = products.filter(item => item.product).map(item => ({
      productId: item.productId,
      productName: item.product!.name,
      productImage: item.product!.images[0],
      price: item.product!.price,
      quantity: item.quantity,
      sellerId: item.product!.sellerId,
    }))

    if (orderItems.length === 0) {
      toast.error("No items in cart")
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: `${address}, ${city}, ${zip}`,
          paymentMethod: "COD",
        })
      })

      if (res.ok) {
        clearCart()
        toast.success("Order placed successfully!")
        router.push("/orders")
      } else {
        const data = await res.json()
        console.error('Order error:', data)
        toast.error(data.message || "Failed to place order")
      }
    } catch (e) {
      console.error('Order exception:', e)
      toast.error("Failed to place order")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <StoreFooter />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <div className="flex flex-1 flex-col items-center justify-center">
          <Package className="h-16 w-16 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium text-foreground">Your cart is empty</p>
          <Link href="/products"><Button className="mt-4 bg-primary text-primary-foreground">Continue Shopping</Button></Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

          <form onSubmit={handlePlaceOrder}>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Left - Form */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Shipping */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Truck className="h-5 w-5 text-primary" /> Shipping Address
                  </h2>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Full Address</Label>
                      <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street, Apt 4B" required className="bg-muted" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>City</Label>
                        <Input value={city} onChange={e => setCity(e.target.value)} placeholder="New York" required className="bg-muted" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>ZIP Code</Label>
                        <Input value={zip} onChange={e => setZip(e.target.value)} placeholder="10001" required className="bg-muted" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                  </h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Right - Summary */}
              <div>
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {products.map((item) => item.product && (
                      <div key={item.productId} className="flex items-center gap-3">
                        <img src={item.product.images[0] || "/placeholder.svg"} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span><span className="text-chart-4">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button type="submit" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                    Place Order
                  </Button>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" /> Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
