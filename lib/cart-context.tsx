"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { getStore, type CartItem, type Product } from "./store"
import { useAuth } from "./auth-context"

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartProducts: () => (CartItem & { product: Product | null })[]
  totalItems: number
  totalPrice: number
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [, setRefresh] = useState(0)
  const forceUpdate = useCallback(() => setRefresh(v => v + 1), [])

  const store = getStore()
  const userId = user?.id || "guest"

  const items = store.getCart(userId)

  const addItem = useCallback((productId: string, quantity = 1) => {
    store.addToCart(userId, productId, quantity)
    forceUpdate()
  }, [userId, store, forceUpdate])

  const removeItem = useCallback((productId: string) => {
    store.removeFromCart(userId, productId)
    forceUpdate()
  }, [userId, store, forceUpdate])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      store.removeFromCart(userId, productId)
    } else {
      store.updateCartItem(userId, productId, quantity)
    }
    forceUpdate()
  }, [userId, store, forceUpdate])

  const clearCart = useCallback(() => {
    store.clearCart(userId)
    forceUpdate()
  }, [userId, store, forceUpdate])

  const getCartProducts = useCallback(() => {
    return items.map(item => {
      const product = store.getProductById(item.productId)
      // If product not in store, it might be from database - return placeholder
      if (!product) {
        return {
          ...item,
          product: null
        }
      }
      return {
        ...item,
        product,
      }
    })
  }, [items, store])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => {
    const product = store.getProductById(i.productId)
    return sum + (product ? product.price * i.quantity : 0)
  }, 0)

  const wishlist = store.getWishlist(userId).map(w => w.productId)

  const toggleWishlist = useCallback((productId: string) => {
    if (store.isInWishlist(userId, productId)) {
      store.removeFromWishlist(userId, productId)
    } else {
      store.addToWishlist(userId, productId)
    }
    forceUpdate()
  }, [userId, store, forceUpdate])

  const isInWishlist = useCallback((productId: string) => {
    return store.isInWishlist(userId, productId)
  }, [userId, store])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getCartProducts, totalItems, totalPrice, wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
