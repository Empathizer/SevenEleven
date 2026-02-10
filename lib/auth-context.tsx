"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { getStore, type User, type UserRole } from "./store"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (data: { name: string; email: string; password: string; role: UserRole; storeName?: string; storeDescription?: string }) => { success: boolean; error?: string }
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore user from store on mount (the store singleton keeps currentUserId)
  useEffect(() => {
    const store = getStore()
    const currentUser = store.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const store = getStore()
    const u = store.login(email, password)
    if (u) {
      setUser(u)
      return { success: true }
    }
    return { success: false, error: "Invalid credentials or account not approved" }
  }, [])

  const register = useCallback((data: { name: string; email: string; password: string; role: UserRole; storeName?: string; storeDescription?: string }) => {
    const store = getStore()
    const u = store.register(data)
    if (u) {
      if (u.role === "customer") setUser(u)
      return { success: true }
    }
    return { success: false, error: "Email already exists" }
  }, [])

  const logout = useCallback(() => {
    getStore().logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
