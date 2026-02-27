"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import type { UserRole } from "@/lib/store"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("customer")
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [idType, setIdType] = useState("CNIC")
  const [idNumber, setIdNumber] = useState("")
  const [idImage, setIdImage] = useState("")
  const [address, setAddress] = useState("")
  const [invitationCode, setInvitationCode] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [idImagePreview, setIdImagePreview] = useState("")
  const [error, setError] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setIdImage(base64)
        setIdImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setIdImage("")
    setIdImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (role === "seller" && !termsAccepted) {
      setError("Please accept the terms of service")
      return
    }
    
    const result = await register({ 
      name, 
      email, 
      password, 
      role, 
      storeName: role === "seller" ? storeName : undefined, 
      storeDescription: role === "seller" ? storeDescription : undefined,
      idType: role === "seller" ? idType : undefined,
      idNumber: role === "seller" ? idNumber : undefined,
      idImage: role === "seller" ? (idImage || "https://via.placeholder.com/400") : undefined,
      address: role === "seller" ? address : undefined,
      invitationCode: role === "seller" ? invitationCode : undefined
    })
    
    if (result.success) {
      if (role === "seller") {
        toast("Registration submitted! Awaiting admin approval.")
        router.push("/login")
      } else {
        toast("Account created!")
        router.push("/")
      }
    } else {
      setError(result.error || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">EsellerStore</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Create your account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required className="bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Account Type</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "seller" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="My Store" required className="bg-muted" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeDesc">Store Description</Label>
                  <Textarea id="storeDesc" value={storeDescription} onChange={e => setStoreDescription(e.target.value)} placeholder="Tell us about your store" className="bg-muted" rows={3} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>ID Type</Label>
                    <Select value={idType} onValueChange={setIdType}>
                      <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="CNIC">Natinal ID</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Driving License">Driving License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>ID Number</Label>
                    <Input value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="e.g., 123-45-6789" required className="bg-muted" autoComplete="off" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>ID Image</Label>
                  {!idImagePreview ? (
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="id-upload"
                      />
                      <label 
                        htmlFor="id-upload" 
                        className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload ID image</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={idImagePreview} alt="ID Preview" className="w-full h-48 object-cover rounded-lg border border-border" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Residence Address</Label>
                  <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Your complete address" required className="bg-muted" rows={2} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Invitation Code <span className="text-destructive">*</span></Label>
                  <Input value={invitationCode} onChange={e => setInvitationCode(e.target.value)} placeholder="Enter invitation code" required className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Contact admin to get an invitation code</p>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the terms of service and{' '}
                    <Link href="/seller-policies" className="text-primary hover:underline" target="_blank">seller policies</Link>
                  </label>
                </div>
                
                <p className="rounded-lg bg-chart-3/10 p-3 text-xs text-chart-3">Seller accounts require admin approval before you can start selling.</p>
              </>
            )}

            <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              {role === "seller" ? "Submit for Approval" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
