"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye, MoreVertical, Trash2, User, LogIn, DollarSign, History, Edit, Ban, MessageSquare, Package as PackageIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdminSellersPage() {
  const router = useRouter()
  const [sellers, setSellers] = useState<any[]>([])
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [dialogType, setDialogType] = useState<string>('')
  const [formData, setFormData] = useState<any>({})
  const [productCounts, setProductCounts] = useState<{[key: string]: number}>({})

  useEffect(() => {
    loadSellers()
  }, [])

  const loadSellers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/sellers`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setSellers(data.data)
          // Load product counts for each seller
          data.data.forEach(async (seller: any) => {
            const userId = seller.userId?._id || seller.userId
            const pRes = await fetch(`${API_URL}/api/admin/products?sellerId=${userId}`, { credentials: 'include' })
            if (pRes.ok) {
              const pData = await pRes.json()
              setProductCounts(prev => ({ ...prev, [seller._id]: pData.data?.length || 0 }))
            }
          })
        }
      }
    } catch (e) {}
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/sellers/${id}/approve`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (res.ok) {
        toast.success('Seller approved')
        loadSellers()
      }
    } catch (e) {}
  }

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/sellers/${id}/reject`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (res.ok) {
        toast.success('Seller rejected')
        loadSellers()
      }
    } catch (e) {}
  }

  const updateField = async (userId: string, field: string, value: any) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [field]: value })
      })
      if (res.ok) {
        loadSellers()
      }
    } catch (e) {}
  }

  const getProductCount = (sellerId: string) => {
    return productCounts[sellerId] || 0
  }

  const getRechargeDifference = (seller: any) => {
    return (seller.totalRecharge || 0) - (seller.totalWithdrawn || 0)
  }

  const loginAsSeller = async (seller: any) => {
    try {
      const user = seller.userId || {}
      const userId = typeof user === 'string' ? user : user._id
      console.log('Logging in as user ID:', userId)
      const res = await fetch(`${API_URL}/api/admin/login-as/${userId}`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      console.log('Login response:', data)
      if (res.ok) {
        toast.success(`Logged in as ${seller.storeName || user.name}`)
        setTimeout(() => {
          window.location.href = '/seller'
        }, 500)
      } else {
        toast.error(data.message || 'Failed to login as seller')
      }
    } catch (e: any) {
      console.error('Login error:', e)
      toast.error(e.message || 'Failed to login as seller')
    }
  }

  const banSeller = async (id: string, userId: string) => {
    if (!confirm('Are you sure you want to ban this seller?')) return
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        toast.success('Seller banned')
        loadSellers()
      }
    } catch (e) {}
  }

  const openDialog = async (seller: any, type: string) => {
    setDialogType(type)
    
    if (!seller && type === 'virtualOrder') {
      // Load all products and customers for global virtual order
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/products`, { credentials: 'include' }),
          fetch(`${API_URL}/api/admin/virtual-customers`, { credentials: 'include' })
        ])
        let products = []
        let customers = []
        if (pRes.ok) {
          const pData = await pRes.json()
          products = pData.data || []
        }
        if (cRes.ok) {
          const cData = await cRes.json()
          customers = cData.data || []
        }
        setFormData({ products, customers })
      } catch (e) {
        console.error('Load error:', e)
      }
      return
    }
    
    if (!seller) {
      setFormData({})
      return
    }
    
    const user = seller.userId || {}
    setSelectedSeller({...seller, ...user, sellerId: seller._id, userId: user._id})
    
    let products = []
    let customers = []
    
    if (type === 'virtualOrder') {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/products?sellerId=${user._id}`, { credentials: 'include' }),
          fetch(`${API_URL}/api/admin/virtual-customers`, { credentials: 'include' })
        ])
        if (pRes.ok) {
          const pData = await pRes.json()
          products = pData.data || []
        }
        if (cRes.ok) {
          const cData = await cRes.json()
          customers = cData.data || []
        }
      } catch (e) {
        console.error('Load error:', e)
      }
    }
    
    setFormData({
      guaranteeMoney: user.guaranteeMoney || 0,
      viewsBase: user.viewsBase || 0,
      viewsInc: user.viewsInc || 0,
      package: user.package || '',
      salesman: user.salesman || '',
      message: '',
      products,
      customers
    })
  }

  const handleDialogSubmit = async () => {
    if (!selectedSeller) return
    
    try {
      if (dialogType === 'message') {
        const res = await fetch(`${API_URL}/api/admin/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ receiverId: selectedSeller.userId, message: formData.message })
        })
        if (res.ok) {
          toast.success('Message sent')
          setDialogType('')
          return
        }
      }

      const res = await fetch(`${API_URL}/api/admin/users/${selectedSeller.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        if (dialogType === 'guarantee') toast.success('Guarantee money updated')
        else if (dialogType === 'views') toast.success('Views updated')
        else if (dialogType === 'package') toast.success('Package updated')
        else if (dialogType === 'salesman') toast.success('Salesman updated')
        
        loadSellers()
        setDialogType('')
      }
    } catch (e) {}
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Sellers</h1>
            <p className="mt-1 text-sm text-muted-foreground">Approve, reject, or manage seller accounts.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => openDialog(null, 'generateInvite')} className="bg-primary">
              <Users className="h-4 w-4 mr-2" /> Generate Invitation Code
            </Button>
            <Button onClick={() => openDialog(null, 'virtualOrder')} className="bg-primary">
              <PackageIcon className="h-4 w-4 mr-2" /> Add Virtual Order
            </Button>
            <Button onClick={() => openDialog(null, 'createVirtualSeller')} className="bg-primary">
              <Users className="h-4 w-4 mr-2" /> Add Virtual Seller
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Guarantee</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>信誉分</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Display</TableHead>
                <TableHead>Recharge</TableHead>
                <TableHead>Withdrawal</TableHead>
                <TableHead>Diff</TableHead>
                <TableHead>Salesman</TableHead>
                <TableHead>Invitation</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => {
                const user = seller.userId || {}
                return (
                <TableRow key={seller._id}>
                  <TableCell className="font-medium whitespace-nowrap">{seller.storeName || user.name}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{user.phone || 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{user.email}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openDialog(seller, 'profile')}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : user.status === 'blocked' ? 'destructive' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{getProductCount(seller._id)}</TableCell>
                  <TableCell className="text-sm">${(seller.pendingBalance || 0).toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">${(seller.walletBalance || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-sm">${(user.guaranteeMoney || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{user.viewsBase || 0}/{user.viewsInc || 0}</TableCell>
                  <TableCell className="text-center">{user.creditScore || 100}</TableCell>
                  <TableCell className="text-sm">{user.commentPermission || 'enabled'}</TableCell>
                  <TableCell className="text-sm">{user.homeDisplay || 'show'}</TableCell>
                  <TableCell className="text-sm">${(user.totalRecharge || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-sm">${(user.totalWithdrawn || 0).toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">${((user.totalRecharge || 0) - (user.totalWithdrawn || 0)).toFixed(2)}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{user.salesman || 'N/A'}</TableCell>
                  <TableCell className="text-sm">{seller.invitationCode || 'N/A'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openDialog(seller, 'profile')}>
                          <User className="h-4 w-4 mr-2" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loginAsSeller(seller)}>
                          <LogIn className="h-4 w-4 mr-2" /> Log in as Seller
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/sellers/${user._id}/wallet`)}>
                          <DollarSign className="h-4 w-4 mr-2" /> Go to Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'history')}>
                          <History className="h-4 w-4 mr-2" /> Payment History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDialog(seller, 'edit')}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        {seller.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(seller._id)}>
                              <Check className="h-4 w-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(seller._id)}>
                              <X className="h-4 w-4 mr-2" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => banSeller(seller._id, user._id)} className="text-orange-600">
                          <Ban className="h-4 w-4 mr-2" /> Ban Seller
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'message')}>
                          <MessageSquare className="h-4 w-4 mr-2" /> Message Seller
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDialog(seller, 'guarantee')}>
                          <DollarSign className="h-4 w-4 mr-2" /> Guarantee Money
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'views')}>
                          <Eye className="h-4 w-4 mr-2" /> Views
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'package')}>
                          <PackageIcon className="h-4 w-4 mr-2" /> Set Package
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'salesman')}>
                          <Users className="h-4 w-4 mr-2" /> Set Salesman
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'generateInvite')}>
                          <Users className="h-4 w-4 mr-2" /> Generate Invitation Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(seller, 'virtualOrder')}>
                          <PackageIcon className="h-4 w-4 mr-2" /> Add Virtual Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === 'blocked' ? (
                          <DropdownMenuItem 
                            onClick={async () => {
                              try {
                                const res = await fetch(`${API_URL}/api/admin/users/${user._id}/restore`, {
                                  method: 'PUT',
                                  credentials: 'include'
                                })
                                if (res.ok) {
                                  toast.success('Seller restored')
                                  loadSellers()
                                }
                              } catch (e) {}
                            }}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" /> Restore Seller
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={async () => {
                              if (confirm('Block this seller?')) {
                                try {
                                  const res = await fetch(`${API_URL}/api/admin/users/${user._id}`, {
                                    method: 'DELETE',
                                    credentials: 'include'
                                  })
                                  if (res.ok) {
                                    toast.success('Seller blocked')
                                    loadSellers()
                                  }
                                } catch (e) {}
                              }
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Block Seller
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={dialogType === 'profile'} onOpenChange={() => setDialogType('')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seller Profile - {selectedSeller?.storeName}</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Full Name</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Store Name</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.storeName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Status</p>
                  <Badge variant={selectedSeller.status === 'approved' ? 'default' : 'secondary'}>
                    {selectedSeller.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">ID Type</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.idType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">ID Number</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.idNumber || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">ID Image (KYC Document)</p>
                {selectedSeller.idImage ? (
                  selectedSeller.idImage.startsWith('data:image') || selectedSeller.idImage.startsWith('http') ? (
                    <img src={selectedSeller.idImage} alt="ID" className="w-full max-h-64 object-contain rounded-lg border" />
                  ) : (
                    <div className="rounded-lg border bg-muted p-8 text-center">
                      <a href={`${selectedSeller.idImage}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        View Image
                      </a>
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted p-8 text-center">
                    <p className="text-sm text-muted-foreground">No image uploaded</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Address</p>
                <p className="text-sm text-muted-foreground">{selectedSeller.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Store Description</p>
                <p className="text-sm text-muted-foreground">{selectedSeller.storeDescription || 'N/A'}</p>
              </div>
              {selectedSeller.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => { handleApprove(selectedSeller.sellerId); setDialogType(''); }} className="flex-1">
                    Approve Seller
                  </Button>
                  <Button onClick={() => { handleReject(selectedSeller.sellerId); setDialogType(''); }} variant="destructive" className="flex-1">
                    Reject Seller
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={dialogType === 'history'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment History - {selectedSeller?.storeName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Transaction history coming soon</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guarantee Money Dialog */}
      <Dialog open={dialogType === 'guarantee'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Guarantee Money</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Guarantee Money</Label>
              <Input 
                type="number" 
                value={formData.guaranteeMoney || 0} 
                onChange={(e) => setFormData({...formData, guaranteeMoney: e.target.value})}
              />
            </div>
            <Button onClick={handleDialogSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Views Dialog */}
      <Dialog open={dialogType === 'views'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Views</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Base Views</Label>
              <Input 
                type="number" 
                value={formData.viewsBase || 0} 
                onChange={(e) => setFormData({...formData, viewsBase: e.target.value})}
              />
            </div>
            <div>
              <Label>Increment Views</Label>
              <Input 
                type="number" 
                value={formData.viewsInc || 0} 
                onChange={(e) => setFormData({...formData, viewsInc: e.target.value})}
              />
            </div>
            <Button onClick={handleDialogSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Package Dialog */}
      <Dialog open={dialogType === 'package'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Package Name</Label>
              <Input 
                value={formData.package || ''} 
                onChange={(e) => setFormData({...formData, package: e.target.value})}
                placeholder="e.g., Gold, Premium, Basic"
              />
            </div>
            <Button onClick={handleDialogSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Salesman Dialog */}
      <Dialog open={dialogType === 'salesman'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Salesman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Salesman Name</Label>
              <Input 
                value={formData.salesman || ''} 
                onChange={(e) => setFormData({...formData, salesman: e.target.value})}
                placeholder="Enter salesman name"
              />
            </div>
            <Button onClick={handleDialogSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Invitation Code Dialog */}
      <Dialog open={dialogType === 'generateInvite'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invitation Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={async () => {
              try {
                const res = await fetch(`${API_URL}/api/admin/invitation-codes`, {
                  method: 'POST',
                  credentials: 'include'
                })
                const data = await res.json()
                if (res.ok && data.success) {
                  setFormData({...formData, generatedCode: data.code})
                  toast.success('Invitation code generated')
                } else {
                  toast.error('Failed to generate code')
                }
              } catch (e) {
                toast.error('Failed to generate code')
              }
            }} disabled={formData.generatedCode}>Generate Code</Button>
            
            {formData.generatedCode && (
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-xs">Invitation Code</Label>
                <Input value={formData.generatedCode} readOnly className="bg-background mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Share this code with the seller</p>
              </div>
            )}
            
            <Button onClick={() => { setDialogType(''); setFormData({}); }} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={dialogType === 'message'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Seller - {selectedSeller?.storeName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea 
                value={formData.message || ''} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Type your message here..."
                rows={5}
              />
            </div>
            <Button onClick={handleDialogSubmit}>Send Message</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Order Dialog */}
      <Dialog open={dialogType === 'virtualOrder'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Virtual Order{selectedSeller ? ` - ${selectedSeller.storeName}` : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Product</Label>
              <Select value={formData.productId || ''} onValueChange={(val) => {
                const product = formData.products?.find((p: any) => p._id === val)
                setFormData({...formData, productId: val, selectedProduct: product})
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.products || []).map((p: any) => (
                    <SelectItem key={p._id} value={p._id}>{p.name} - ${p.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Virtual Customer</Label>
              <Select value={formData.customerId || ''} onValueChange={(val) => {
                const customer = formData.customers?.find((c: any) => c._id === val)
                setFormData({...formData, customerId: val, selectedCustomer: customer})
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.customers || []).map((c: any) => (
                    <SelectItem key={c._id} value={c._id}>{c.name} - {c.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input 
                type="number"
                value={formData.quantity || 1} 
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="1"
              />
            </div>
            <Button onClick={async () => {
              if (!formData.productId || !formData.customerId) {
                toast.error('Please select product and customer')
                return
              }
              try {
                const product = formData.selectedProduct
                const customer = formData.selectedCustomer
                const quantity = parseInt(formData.quantity) || 1
                const sellerId = product.sellerId || (selectedSeller?.userId)
                
                if (!sellerId) {
                  toast.error('Product has no seller')
                  return
                }
                
                const res = await fetch(`${API_URL}/api/admin/orders/virtual`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    customerId: customer._id,
                    sellerId,
                    items: [{
                      productId: product._id,
                      productName: product.name,
                      productImage: product.images?.[0] || '',
                      price: product.price,
                      quantity,
                      buyingPrice: product.buyingPrice || 0
                    }],
                    totalAmount: product.price * quantity,
                    shippingAddress: customer.address || 'Virtual Address'
                  })
                })
                if (res.ok) {
                  toast.success('Virtual order created')
                  setDialogType('')
                  setFormData({})
                } else {
                  const data = await res.json()
                  toast.error(data.message || 'Failed to create order')
                }
              } catch (e) {
                console.error('Create order error:', e)
                toast.error('Failed to create order')
              }
            }} disabled={!formData.productId || !formData.customerId}>Create Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Virtual Seller Dialog */}
      <Dialog open={dialogType === 'createVirtualSeller'} onOpenChange={() => setDialogType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Virtual Seller</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={async () => {
              const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com']
              const randomDomain = domains[Math.floor(Math.random() * domains.length)]
              const randomEmail = `seller${Math.floor(Math.random() * 100000)}@${randomDomain}`
              const randomPassword = Math.random().toString(36).slice(-8)
              
              try {
                const res = await fetch(`${API_URL}/api/admin/sellers/virtual`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    name: `Virtual Store ${Math.floor(Math.random() * 1000)}`,
                    email: randomEmail,
                    password: randomPassword,
                    storeName: `Virtual Store ${Math.floor(Math.random() * 1000)}`
                  })
                })
                if (res.ok) {
                  const data = await res.json()
                  setFormData({ 
                    createdEmail: randomEmail, 
                    createdPassword: randomPassword,
                    invitationCode: data.invitationCode,
                    created: true 
                  })
                  toast.success('Virtual seller created')
                  loadSellers()
                } else {
                  const data = await res.json()
                  toast.error(data.message || 'Failed to create seller')
                }
              } catch (e) {
                toast.error('Failed to create seller')
              }
            }} disabled={formData.created}>Generate Virtual Seller</Button>
            
            {formData.created && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold">Virtual Seller Created!</p>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input value={formData.createdEmail} readOnly className="bg-background" />
                </div>
                <div>
                  <Label className="text-xs">Password</Label>
                  <Input value={formData.createdPassword} readOnly className="bg-background" />
                </div>
                <div>
                  <Label className="text-xs">Invitation Code</Label>
                  <Input value={formData.invitationCode} readOnly className="bg-background" />
                </div>
                <p className="text-xs text-muted-foreground">Save these credentials for future login</p>
              </div>
            )}
            
            <Button onClick={() => { setDialogType(''); setFormData({}); }} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - All Fields */}
      <Dialog open={dialogType === 'edit'} onOpenChange={() => setDialogType('')}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Seller - {selectedSeller?.storeName}</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Store Name</Label>
                  <Input 
                    value={selectedSeller.storeName || ''} 
                    onChange={async (e) => {
                      const newValue = e.target.value
                      setSelectedSeller({...selectedSeller, storeName: newValue})
                      await updateField(selectedSeller.userId, 'storeName', newValue)
                    }}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input 
                    value={selectedSeller.phone || ''} 
                    onChange={async (e) => {
                      const newValue = e.target.value
                      setSelectedSeller({...selectedSeller, phone: newValue})
                      await updateField(selectedSeller.userId, 'phone', newValue)
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pending Balance</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.pendingBalance || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, pendingBalance: newValue})
                      await fetch(`${API_URL}/api/admin/sellers/${selectedSeller.sellerId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ pendingBalance: newValue })
                      })
                      loadSellers()
                    }}
                  />
                </div>
                <div>
                  <Label>Wallet Money</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.walletBalance || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, walletBalance: newValue})
                      await fetch(`${API_URL}/api/admin/sellers/${selectedSeller.sellerId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ walletBalance: newValue })
                      })
                      loadSellers()
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Guarantee Money</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.guaranteeMoney || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, guaranteeMoney: newValue})
                      await updateField(selectedSeller.userId, 'guaranteeMoney', newValue)
                    }}
                  />
                </div>
                <div>
                  <Label>Credit Score (信誉分)</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.creditScore || 100} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, creditScore: newValue})
                      await updateField(selectedSeller.userId, 'creditScore', newValue)
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Views Base</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.viewsBase || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, viewsBase: newValue})
                      await updateField(selectedSeller.userId, 'viewsBase', newValue)
                    }}
                  />
                </div>
                <div>
                  <Label>Views Increment</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.viewsInc || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, viewsInc: newValue})
                      await updateField(selectedSeller.userId, 'viewsInc', newValue)
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Comment Permission</Label>
                  <Select 
                    value={selectedSeller.commentPermission || 'enabled'} 
                    onValueChange={async (val) => {
                      setSelectedSeller({...selectedSeller, commentPermission: val})
                      await updateField(selectedSeller.userId, 'commentPermission', val)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Home Display</Label>
                  <Select 
                    value={selectedSeller.homeDisplay || 'show'} 
                    onValueChange={async (val) => {
                      setSelectedSeller({...selectedSeller, homeDisplay: val})
                      await updateField(selectedSeller.userId, 'homeDisplay', val)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="show">Show</SelectItem>
                      <SelectItem value="hide">Hide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Recharge</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.totalRecharge || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, totalRecharge: newValue})
                      await updateField(selectedSeller.userId, 'totalRecharge', newValue)
                    }}
                  />
                </div>
                <div>
                  <Label>Total Withdrawal</Label>
                  <Input 
                    type="number"
                    value={selectedSeller.totalWithdrawn || 0} 
                    onChange={async (e) => {
                      const newValue = Number(e.target.value)
                      setSelectedSeller({...selectedSeller, totalWithdrawn: newValue})
                      await updateField(selectedSeller.userId, 'totalWithdrawn', newValue)
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Package</Label>
                  <Input 
                    value={selectedSeller.package || ''} 
                    onChange={async (e) => {
                      const newValue = e.target.value
                      setSelectedSeller({...selectedSeller, package: newValue})
                      await updateField(selectedSeller.userId, 'package', newValue)
                    }}
                    placeholder="e.g., Gold, Premium, Basic"
                  />
                </div>
                <div>
                  <Label>Salesman</Label>
                  <Input 
                    value={selectedSeller.salesman || ''} 
                    onChange={async (e) => {
                      const newValue = e.target.value
                      setSelectedSeller({...selectedSeller, salesman: newValue})
                      await updateField(selectedSeller.userId, 'salesman', newValue)
                    }}
                    placeholder="Salesman name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Type</Label>
                  <Select 
                    value={selectedSeller.idType || 'CNIC'} 
                    onValueChange={async (val) => {
                      setSelectedSeller({...selectedSeller, idType: val})
                      await updateField(selectedSeller.userId, 'idType', val)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNIC">National ID</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Driving License">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ID Number</Label>
                  <Input 
                    value={selectedSeller.idNumber || ''} 
                    onChange={async (e) => {
                      const newValue = e.target.value
                      setSelectedSeller({...selectedSeller, idNumber: newValue})
                      await updateField(selectedSeller.userId, 'idNumber', newValue)
                    }}
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea 
                  value={selectedSeller.address || ''} 
                  onChange={async (e) => {
                    const newValue = e.target.value
                    setSelectedSeller({...selectedSeller, address: newValue})
                    await updateField(selectedSeller.userId, 'address', newValue)
                  }}
                  rows={2}
                />
              </div>
              <div>
                <Label>Store Description</Label>
                <Textarea 
                  value={selectedSeller.storeDescription || ''} 
                  onChange={async (e) => {
                    const newValue = e.target.value
                    setSelectedSeller({...selectedSeller, storeDescription: newValue})
                    await updateField(selectedSeller.userId, 'storeDescription', newValue)
                  }}
                  rows={3}
                />
              </div>
              <div>
                <Label>Invitation Code</Label>
                <Input 
                  value={selectedSeller.invitationCode || ''} 
                  onChange={async (e) => {
                    const newValue = e.target.value
                    setSelectedSeller({...selectedSeller, invitationCode: newValue})
                    await updateField(selectedSeller.userId, 'invitationCode', newValue)
                  }}
                />
              </div>
              <Button onClick={() => { 
                toast.success('Seller updated successfully')
                setDialogType('')
                loadSellers()
              }} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
