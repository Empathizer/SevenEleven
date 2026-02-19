"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Store, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function SellerRegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [idType, setIdType] = useState("CNIC")
  const [idNumber, setIdNumber] = useState("")
  const [idImage, setIdImage] = useState("")
  const [idImagePreview, setIdImagePreview] = useState("")
  const [address, setAddress] = useState("")
  const [invitationCode, setInvitationCode] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters")
      return
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    
    if (storeName.trim().length < 3) {
      setError("Store name must be at least 3 characters")
      return
    }
    
    if (!idNumber.trim()) {
      setError("ID number is required")
      return
    }
    
    if (!idImage) {
      setError("Please upload your ID image")
      return
    }
    
    if (address.trim().length < 10) {
      setError("Please provide a complete address (minimum 10 characters)")
      return
    }
    
    if (!termsAccepted) {
      setError("Please accept the terms of service")
      return
    }
    
    const result = register({ 
      name, 
      email, 
      password, 
      role: "seller", 
      storeName, 
      storeDescription,
      idType,
      idNumber,
      idImage,
      address,
      invitationCode
    })
    
    if (result.success) {
      toast.success("Application submitted! Awaiting admin approval.")
      router.push("/login")
    } else {
      setError(result.error || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">EsellerStore</span>
            </Link>
            <div className="mt-3 flex items-center gap-2 text-muted-foreground">
              <Store className="h-4 w-4" />
              <span className="text-sm">Start selling on EsellerStore</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="bg-muted" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Min 6 characters" 
                required 
                minLength={6}
                className="bg-muted" 
              />
              {password && password.length < 6 && (
                <p className="text-xs text-destructive">Password must be at least 6 characters</p>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Store Name</Label>
              <Input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Your store name" required className="bg-muted" />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Store Description</Label>
              <Textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)} placeholder="What does your store sell?" className="bg-muted" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>ID Type</Label>
                <Select value={idType} onValueChange={setIdType}>
                  <SelectTrigger className="bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNIC">National ID</SelectItem>
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
              <Label>ID Image *</Label>
              {!idImagePreview ? (
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                    id="id-upload"
                    required
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
              <p className="text-xs text-muted-foreground">Required: Upload a clear photo of your ID document</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Residence Address</Label>
              <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Your complete address" required className="bg-muted" rows={2} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Invitation Code (Optional)</Label>
              <Input value={invitationCode} onChange={e => setInvitationCode(e.target.value)} placeholder="Enter code if you have one" className="bg-muted" />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the terms of service and{' '}
                <Link href="/seller-policies" className="text-primary hover:underline" target="_blank">seller policies</Link>
              </label>
            </div>

            <div className="rounded-lg bg-primary/5 p-4 text-xs text-muted-foreground">
              Your account will be reviewed by our admin team before approval. You will be notified via email once approved.
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">Submit Application</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have a seller account? <Link href="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
