// In-memory store for the e-commerce platform
// This simulates a database for demo purposes

export type UserRole = "admin" | "seller" | "customer"
export type SellerStatus = "pending" | "approved" | "rejected"
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  sellerStatus?: SellerStatus
  emailVerified?: boolean
  storeName?: string
  storeDescription?: string
  idType?: string
  idNumber?: string
  idImage?: string
  address?: string
  invitationCode?: string
  avatar?: string
  walletBalance?: number
  totalEarnings?: number
  totalWithdrawn?: number
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  productCount: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  categorySlug: string
  stock: number
  sellerId: string
  sellerName: string
  rating: number
  reviewCount: number
  sold: number
  featured: boolean
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface WishlistItem {
  productId: string
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  sellerId: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress: string
  paymentMethod: string
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  active: boolean
}

export type TransactionType = "deposit" | "earning" | "withdrawal" | "adjustment"

export interface WalletTransaction {
  id: string
  sellerId: string
  type: TransactionType
  amount: number
  note: string
  createdBy: string
  createdAt: string
}

// ---- Initial Data ----

const categories: Category[] = [
  { id: "cat-1", name: "Jewelry", slug: "jewelry", image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400&h=400&fit=crop", productCount: 0 },
  { id: "cat-2", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop", productCount: 0 },
  { id: "cat-3", name: "Men's Apparel", slug: "mens-apparel", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", productCount: 0 },
  { id: "cat-4", name: "Women's Apparel", slug: "womens-apparel", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop", productCount: 0 },
  { id: "cat-5", name: "Shoes", slug: "shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", productCount: 0 },
  { id: "cat-6", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop", productCount: 0 },
  { id: "cat-7", name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", productCount: 0 },
]

const users: User[] = [
  { id: "user-admin", name: "Admin", email: "admin@seveneleven.com", password: "admin123", role: "admin", emailVerified: true, createdAt: "2025-01-01T00:00:00Z" },
  { id: "user-seller-1", name: "StyleHub Store", email: "seller@seveneleven.com", password: "seller123", role: "seller", sellerStatus: "approved", emailVerified: true, storeName: "StyleHub", storeDescription: "Premium fashion and accessories", idType: "CNIC", idNumber: "12345-1234567-1", idImage: "https://via.placeholder.com/400", address: "123 Fashion Street, New York, NY 10001", invitationCode: "STYLE2025", walletBalance: 1250.50, totalEarnings: 3500.00, totalWithdrawn: 2249.50, createdAt: "2025-01-05T00:00:00Z" },
  { id: "user-seller-2", name: "GlamGlow Beauty", email: "glamglow@seveneleven.com", password: "seller123", role: "seller", sellerStatus: "approved", emailVerified: true, storeName: "GlamGlow Beauty", storeDescription: "Your one-stop beauty shop", idType: "Passport", idNumber: "AB1234567", idImage: "https://via.placeholder.com/400", address: "456 Beauty Ave, Los Angeles, CA 90001", invitationCode: "GLAM2025", walletBalance: 890.25, totalEarnings: 1890.25, totalWithdrawn: 1000.00, createdAt: "2025-01-10T00:00:00Z" },
  { id: "user-seller-3", name: "TechWear Co", email: "techwear@seveneleven.com", password: "seller123", role: "seller", sellerStatus: "pending", emailVerified: false, storeName: "TechWear Co", storeDescription: "Modern tech accessories", idType: "Driving License", idNumber: "DL-987654321", idImage: "https://via.placeholder.com/400", address: "789 Tech Boulevard, San Francisco, CA 94102", invitationCode: "TECH2025", walletBalance: 0, totalEarnings: 0, totalWithdrawn: 0, createdAt: "2025-02-01T00:00:00Z" },
  { id: "user-cust-1", name: "Sarah Johnson", email: "customer@seveneleven.com", password: "customer123", role: "customer", emailVerified: true, createdAt: "2025-01-15T00:00:00Z" },
  { id: "user-cust-2", name: "Mike Wilson", email: "mike@seveneleven.com", password: "customer123", role: "customer", emailVerified: true, createdAt: "2025-01-20T00:00:00Z" },
]

const products: Product[] = [
  { id: "prod-1", name: "Diamond Pendant Necklace", description: "Elegant diamond pendant necklace crafted in 18K gold. A timeless piece that adds a touch of luxury to any outfit.", price: 129.99, originalPrice: 199.99, images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop"], category: "Jewelry", categorySlug: "jewelry", stock: 25, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.8, reviewCount: 156, sold: 342, featured: true, createdAt: "2025-01-10T00:00:00Z" },
  { id: "prod-2", name: "Crystal Drop Earrings", description: "Beautiful crystal drop earrings that catch the light perfectly. Perfect for special occasions.", price: 49.99, originalPrice: 79.99, images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop"], category: "Jewelry", categorySlug: "jewelry", stock: 50, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.6, reviewCount: 89, sold: 203, featured: true, createdAt: "2025-01-12T00:00:00Z" },
  { id: "prod-3", name: "Floral Summer Dress", description: "Light and airy floral summer dress made from premium cotton. Perfect for warm days.", price: 59.99, originalPrice: 89.99, images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop"], category: "Fashion", categorySlug: "fashion", stock: 100, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.5, reviewCount: 234, sold: 567, featured: true, createdAt: "2025-01-15T00:00:00Z" },
  { id: "prod-4", name: "Classic Leather Jacket", description: "Premium genuine leather jacket with a classic biker style. Built to last.", price: 199.99, originalPrice: 299.99, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop"], category: "Men's Apparel", categorySlug: "mens-apparel", stock: 30, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.7, reviewCount: 178, sold: 289, featured: true, createdAt: "2025-01-18T00:00:00Z" },
  { id: "prod-5", name: "Slim Fit Chino Pants", description: "Comfortable slim fit chino pants available in multiple colors. Great for casual and semi-formal occasions.", price: 39.99, originalPrice: 59.99, images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop"], category: "Men's Apparel", categorySlug: "mens-apparel", stock: 200, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.4, reviewCount: 312, sold: 890, featured: false, createdAt: "2025-01-20T00:00:00Z" },
  { id: "prod-6", name: "Elegant Silk Blouse", description: "Luxurious silk blouse with a flattering cut. Versatile for work and evening wear.", price: 79.99, originalPrice: 119.99, images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop"], category: "Women's Apparel", categorySlug: "womens-apparel", stock: 75, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.6, reviewCount: 145, sold: 421, featured: true, createdAt: "2025-01-22T00:00:00Z" },
  { id: "prod-7", name: "Running Sneakers Pro", description: "High-performance running shoes with advanced cushioning technology. Lightweight and breathable.", price: 89.99, originalPrice: 129.99, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"], category: "Shoes", categorySlug: "shoes", stock: 150, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.8, reviewCount: 567, sold: 1234, featured: true, createdAt: "2025-01-25T00:00:00Z" },
  { id: "prod-8", name: "Leather Oxford Shoes", description: "Classic leather oxford shoes handcrafted from Italian leather. Perfect for formal occasions.", price: 149.99, originalPrice: 219.99, images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop"], category: "Shoes", categorySlug: "shoes", stock: 40, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.7, reviewCount: 98, sold: 176, featured: false, createdAt: "2025-01-28T00:00:00Z" },
  { id: "prod-9", name: "Designer Sunglasses", description: "UV400 protection designer sunglasses with polarized lenses. Stylish and protective.", price: 34.99, originalPrice: 54.99, images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"], category: "Accessories", categorySlug: "accessories", stock: 300, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.3, reviewCount: 421, sold: 987, featured: true, createdAt: "2025-02-01T00:00:00Z" },
  { id: "prod-10", name: "Luxury Watch Collection", description: "Premium stainless steel automatic watch with sapphire crystal. A statement piece.", price: 249.99, originalPrice: 399.99, images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop"], category: "Accessories", categorySlug: "accessories", stock: 15, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.9, reviewCount: 67, sold: 89, featured: true, createdAt: "2025-02-05T00:00:00Z" },
  { id: "prod-11", name: "Vitamin C Serum", description: "Brightening vitamin C serum with hyaluronic acid. Reduces dark spots and improves skin radiance.", price: 24.99, originalPrice: 39.99, images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop"], category: "Beauty", categorySlug: "beauty", stock: 500, sellerId: "user-seller-2", sellerName: "GlamGlow Beauty", rating: 4.7, reviewCount: 892, sold: 2341, featured: true, createdAt: "2025-02-08T00:00:00Z" },
  { id: "prod-12", name: "Matte Lipstick Set", description: "Set of 6 long-lasting matte lipsticks in trending shades. Cruelty-free formula.", price: 29.99, originalPrice: 49.99, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop"], category: "Beauty", categorySlug: "beauty", stock: 200, sellerId: "user-seller-2", sellerName: "GlamGlow Beauty", rating: 4.5, reviewCount: 345, sold: 876, featured: false, createdAt: "2025-02-10T00:00:00Z" },
  { id: "prod-13", name: "Gold Bangle Bracelet", description: "Handcrafted 14K gold bangle bracelet with intricate geometric patterns.", price: 89.99, originalPrice: 139.99, images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop"], category: "Jewelry", categorySlug: "jewelry", stock: 35, sellerId: "user-seller-2", sellerName: "GlamGlow Beauty", rating: 4.6, reviewCount: 112, sold: 198, featured: false, createdAt: "2025-02-12T00:00:00Z" },
  { id: "prod-14", name: "Canvas Tote Bag", description: "Durable canvas tote bag with leather handles. Eco-friendly and stylish.", price: 29.99, originalPrice: 44.99, images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop"], category: "Accessories", categorySlug: "accessories", stock: 180, sellerId: "user-seller-2", sellerName: "GlamGlow Beauty", rating: 4.4, reviewCount: 267, sold: 654, featured: false, createdAt: "2025-02-15T00:00:00Z" },
  { id: "prod-15", name: "High Heel Pumps", description: "Elegant pointed-toe high heel pumps in classic black. Perfect for evening events.", price: 69.99, originalPrice: 99.99, images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop"], category: "Shoes", categorySlug: "shoes", stock: 60, sellerId: "user-seller-2", sellerName: "GlamGlow Beauty", rating: 4.5, reviewCount: 189, sold: 445, featured: true, createdAt: "2025-02-18T00:00:00Z" },
  { id: "prod-16", name: "Denim Jacket Vintage", description: "Classic vintage wash denim jacket with a relaxed fit. A wardrobe essential.", price: 54.99, originalPrice: 84.99, images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop"], category: "Fashion", categorySlug: "fashion", stock: 90, sellerId: "user-seller-1", sellerName: "StyleHub", rating: 4.3, reviewCount: 201, sold: 534, featured: false, createdAt: "2025-02-20T00:00:00Z" },
]

const orders: Order[] = [
  { id: "order-1", userId: "user-cust-1", items: [{ productId: "prod-1", productName: "Diamond Pendant Necklace", productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop", price: 129.99, quantity: 1, sellerId: "user-seller-1" }, { productId: "prod-11", productName: "Vitamin C Serum", productImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop", price: 24.99, quantity: 2, sellerId: "user-seller-2" }], total: 179.97, status: "delivered", shippingAddress: "123 Main St, New York, NY 10001", paymentMethod: "Credit Card", createdAt: "2025-02-01T10:00:00Z" },
  { id: "order-2", userId: "user-cust-1", items: [{ productId: "prod-7", productName: "Running Sneakers Pro", productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", price: 89.99, quantity: 1, sellerId: "user-seller-1" }], total: 89.99, status: "shipped", shippingAddress: "123 Main St, New York, NY 10001", paymentMethod: "PayPal", createdAt: "2025-02-10T14:30:00Z" },
  { id: "order-3", userId: "user-cust-2", items: [{ productId: "prod-3", productName: "Floral Summer Dress", productImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop", price: 59.99, quantity: 1, sellerId: "user-seller-1" }, { productId: "prod-12", productName: "Matte Lipstick Set", productImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop", price: 29.99, quantity: 1, sellerId: "user-seller-2" }], total: 89.98, status: "processing", shippingAddress: "456 Oak Ave, Los Angeles, CA 90001", paymentMethod: "Credit Card", createdAt: "2025-02-15T09:00:00Z" },
  { id: "order-4", userId: "user-cust-2", items: [{ productId: "prod-10", productName: "Luxury Watch Collection", productImage: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop", price: 249.99, quantity: 1, sellerId: "user-seller-1" }], total: 249.99, status: "pending", shippingAddress: "456 Oak Ave, Los Angeles, CA 90001", paymentMethod: "Bank Transfer", createdAt: "2025-02-18T16:45:00Z" },
]

const banners: Banner[] = [
  { id: "banner-1", title: "Mega Sale - Up to 70% Off", subtitle: "Shop the biggest deals of the season on fashion, beauty, and accessories", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop", link: "/products", active: true },
  { id: "banner-2", title: "New Arrivals in Beauty", subtitle: "Discover the latest skincare and makeup essentials from top brands", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop", link: "/products?category=beauty", active: true },
  { id: "banner-3", title: "Summer Collection 2025", subtitle: "Fresh styles for the new season - dresses, shoes, and more", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop", link: "/products?category=fashion", active: true },
]

// ---- Store class ----

class Store {
  private users: User[] = [...users]
  private products: Product[] = [...products]
  private categories: Category[] = [...categories]
  private orders: Order[] = [...orders]
  private banners: Banner[] = [...banners]
  private carts: Map<string, CartItem[]> = new Map()
  private wishlists: Map<string, WishlistItem[]> = new Map()
  private transactions: WalletTransaction[] = []
  private currentUserId: string | null = null

  constructor() {
    this.updateCategoryCounts()
    this.initializeTransactions()
  }

  private initializeTransactions() {
    this.transactions = [
      { id: "txn-1", sellerId: "user-seller-1", type: "deposit", amount: 500, note: "Initial deposit", createdBy: "user-admin", createdAt: "2025-01-06T00:00:00Z" },
      { id: "txn-2", sellerId: "user-seller-1", type: "earning", amount: 3000, note: "Sales earnings", createdBy: "system", createdAt: "2025-02-01T00:00:00Z" },
      { id: "txn-3", sellerId: "user-seller-1", type: "adjustment", amount: -2249.50, note: "Withdrawal processed", createdBy: "user-admin", createdAt: "2025-02-10T00:00:00Z" },
      { id: "txn-4", sellerId: "user-seller-2", type: "deposit", amount: 300, note: "Welcome bonus", createdBy: "user-admin", createdAt: "2025-01-11T00:00:00Z" },
      { id: "txn-5", sellerId: "user-seller-2", type: "earning", amount: 1590.25, note: "Sales earnings", createdBy: "system", createdAt: "2025-02-05T00:00:00Z" },
      { id: "txn-6", sellerId: "user-seller-2", type: "adjustment", amount: -1000, note: "Withdrawal to bank account", createdBy: "user-admin", createdAt: "2025-02-15T00:00:00Z" },
    ]
  }

  private updateCategoryCounts() {
    for (const cat of this.categories) {
      cat.productCount = this.products.filter(p => p.categorySlug === cat.slug).length
    }
  }

  // Auth
  login(email: string, password: string): User | null {
    const user = this.users.find(u => u.email === email && u.password === password)
    if (user) {
      if (user.role === "seller" && user.sellerStatus !== "approved") {
        return null
      }
      this.currentUserId = user.id
    }
    return user || null
  }

  register(data: { name: string; email: string; password: string; role: UserRole; storeName?: string; storeDescription?: string; idType?: string; idNumber?: string; idImage?: string; address?: string; invitationCode?: string }): User | null {
    if (this.users.find(u => u.email === data.email)) return null
    const user: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      sellerStatus: data.role === "seller" ? "pending" : undefined,
      emailVerified: data.role === "customer" ? true : false,
      storeName: data.storeName,
      storeDescription: data.storeDescription,
      idType: data.idType,
      idNumber: data.idNumber,
      idImage: data.idImage,
      address: data.address,
      invitationCode: data.invitationCode,
      walletBalance: data.role === "seller" ? 0 : undefined,
      totalEarnings: data.role === "seller" ? 0 : undefined,
      totalWithdrawn: data.role === "seller" ? 0 : undefined,
      createdAt: new Date().toISOString(),
    }
    this.users.push(user)
    if (data.role === "customer") this.currentUserId = user.id
    return user
  }

  logout() { this.currentUserId = null }
  getCurrentUser(): User | null { return this.users.find(u => u.id === this.currentUserId) || null }
  setCurrentUser(id: string) { this.currentUserId = id }

  // Users
  getUsers(): User[] { return this.users }
  getUserById(id: string): User | null { return this.users.find(u => u.id === id) || null }
  updateUser(id: string, data: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id)
    if (idx === -1) return null
    this.users[idx] = { ...this.users[idx], ...data }
    return this.users[idx]
  }
  deleteUser(id: string) { this.users = this.users.filter(u => u.id !== id) }
  getPendingSellers(): User[] { return this.users.filter(u => u.role === "seller" && u.sellerStatus === "pending") }
  approveSeller(id: string) { 
    const user = this.updateUser(id, { sellerStatus: "approved", emailVerified: true })
    if (user) {
      // Send email notification
      if (typeof window !== 'undefined') {
        // Client-side: Import dynamically to avoid SSR issues
        import('./email').then(({ sendSellerApprovalEmail }) => {
          sendSellerApprovalEmail({
            email: user.email,
            name: user.name,
            storeName: user.storeName || 'Your Store'
          })
        })
      }
    }
    return user
  }
  rejectSeller(id: string) { return this.updateUser(id, { sellerStatus: "rejected" }) }

  // Categories
  getCategories(): Category[] { this.updateCategoryCounts(); return this.categories }
  getCategoryBySlug(slug: string): Category | null { return this.categories.find(c => c.slug === slug) || null }
  addCategory(data: Omit<Category, "id" | "productCount">): Category {
    const cat: Category = { ...data, id: `cat-${Date.now()}`, productCount: 0 }
    this.categories.push(cat)
    return cat
  }
  updateCategory(id: string, data: Partial<Category>): Category | null {
    const idx = this.categories.findIndex(c => c.id === id)
    if (idx === -1) return null
    this.categories[idx] = { ...this.categories[idx], ...data }
    return this.categories[idx]
  }
  deleteCategory(id: string) { this.categories = this.categories.filter(c => c.id !== id) }

  // Products
  getProducts(filter?: { category?: string; sellerId?: string; featured?: boolean; search?: string }): Product[] {
    let result = this.products
    if (filter?.category) result = result.filter(p => p.categorySlug === filter.category)
    if (filter?.sellerId) result = result.filter(p => p.sellerId === filter.sellerId)
    if (filter?.featured) result = result.filter(p => p.featured)
    if (filter?.search) {
      const q = filter.search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    return result
  }
  getProductById(id: string): Product | null { return this.products.find(p => p.id === id) || null }
  addProduct(data: Omit<Product, "id" | "rating" | "reviewCount" | "sold" | "createdAt">): Product {
    const prod: Product = { ...data, id: `prod-${Date.now()}`, rating: 0, reviewCount: 0, sold: 0, createdAt: new Date().toISOString() }
    this.products.push(prod)
    this.updateCategoryCounts()
    return prod
  }
  updateProduct(id: string, data: Partial<Product>): Product | null {
    const idx = this.products.findIndex(p => p.id === id)
    if (idx === -1) return null
    this.products[idx] = { ...this.products[idx], ...data }
    this.updateCategoryCounts()
    return this.products[idx]
  }
  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id)
    this.updateCategoryCounts()
  }

  // Cart
  getCart(userId: string): CartItem[] { return this.carts.get(userId) || [] }
  addToCart(userId: string, productId: string, quantity: number = 1) {
    const cart = this.getCart(userId)
    const existing = cart.find(i => i.productId === productId)
    if (existing) { existing.quantity += quantity }
    else { cart.push({ productId, quantity }) }
    this.carts.set(userId, cart)
  }
  updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = this.getCart(userId)
    const item = cart.find(i => i.productId === productId)
    if (item) { item.quantity = quantity }
    this.carts.set(userId, cart)
  }
  removeFromCart(userId: string, productId: string) {
    const cart = this.getCart(userId).filter(i => i.productId !== productId)
    this.carts.set(userId, cart)
  }
  clearCart(userId: string) { this.carts.set(userId, []) }

  // Wishlist
  getWishlist(userId: string): WishlistItem[] { return this.wishlists.get(userId) || [] }
  addToWishlist(userId: string, productId: string) {
    const wl = this.getWishlist(userId)
    if (!wl.find(i => i.productId === productId)) { wl.push({ productId }) }
    this.wishlists.set(userId, wl)
  }
  removeFromWishlist(userId: string, productId: string) {
    const wl = this.getWishlist(userId).filter(i => i.productId !== productId)
    this.wishlists.set(userId, wl)
  }
  isInWishlist(userId: string, productId: string): boolean {
    return this.getWishlist(userId).some(i => i.productId === productId)
  }

  // Orders
  getOrders(filter?: { userId?: string; sellerId?: string }): Order[] {
    let result = this.orders
    if (filter?.userId) result = result.filter(o => o.userId === filter.userId)
    if (filter?.sellerId) result = result.filter(o => o.items.some(i => i.sellerId === filter.sellerId))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  getOrderById(id: string): Order | null { return this.orders.find(o => o.id === id) || null }
  createOrder(data: Omit<Order, "id" | "createdAt">): Order {
    const order: Order = { ...data, id: `order-${Date.now()}`, createdAt: new Date().toISOString() }
    this.orders.push(order)
    return order
  }
  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const order = this.orders.find(o => o.id === id)
    if (order) order.status = status
    return order || null
  }

  // Banners
  getBanners(activeOnly = false): Banner[] { return activeOnly ? this.banners.filter(b => b.active) : this.banners }
  addBanner(data: Omit<Banner, "id">): Banner {
    const banner: Banner = { ...data, id: `banner-${Date.now()}` }
    this.banners.push(banner)
    return banner
  }
  updateBanner(id: string, data: Partial<Banner>): Banner | null {
    const idx = this.banners.findIndex(b => b.id === id)
    if (idx === -1) return null
    this.banners[idx] = { ...this.banners[idx], ...data }
    return this.banners[idx]
  }
  deleteBanner(id: string) { this.banners = this.banners.filter(b => b.id !== id) }

  // Stats
  getAdminStats() {
    const totalSales = this.orders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = this.orders.length
    const totalSellers = this.users.filter(u => u.role === "seller").length
    const totalCustomers = this.users.filter(u => u.role === "customer").length
    const totalProducts = this.products.length
    const pendingSellers = this.getPendingSellers().length
    return { totalSales, totalOrders, totalSellers, totalCustomers, totalProducts, pendingSellers }
  }

  getSellerStats(sellerId: string) {
    const sellerProducts = this.products.filter(p => p.sellerId === sellerId)
    const sellerOrders = this.orders.filter(o => o.items.some(i => i.sellerId === sellerId))
    const totalSales = sellerOrders.reduce((sum, o) => {
      return sum + o.items.filter(i => i.sellerId === sellerId).reduce((s, i) => s + i.price * i.quantity, 0)
    }, 0)
    const totalOrders = sellerOrders.length
    const totalProducts = sellerProducts.length
    const topProducts = sellerProducts.sort((a, b) => b.sold - a.sold).slice(0, 5)
    return { totalSales, totalOrders, totalProducts, topProducts }
  }

  // Wallet & Transactions
  getSellerWallet(sellerId: string) {
    const seller = this.users.find(u => u.id === sellerId && u.role === "seller")
    if (!seller) return null
    return {
      walletBalance: seller.walletBalance || 0,
      totalEarnings: seller.totalEarnings || 0,
      totalWithdrawn: seller.totalWithdrawn || 0,
    }
  }

  getTransactions(sellerId: string): WalletTransaction[] {
    return this.transactions.filter(t => t.sellerId === sellerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  addDeposit(sellerId: string, amount: number, note: string, adminId: string): WalletTransaction | null {
    const seller = this.users.find(u => u.id === sellerId && u.role === "seller")
    if (!seller || amount <= 0) return null
    
    seller.walletBalance = (seller.walletBalance || 0) + amount
    seller.totalEarnings = (seller.totalEarnings || 0) + amount
    
    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      sellerId,
      type: "deposit",
      amount,
      note,
      createdBy: adminId,
      createdAt: new Date().toISOString(),
    }
    this.transactions.push(transaction)
    return transaction
  }

  deductAmount(sellerId: string, amount: number, note: string, adminId: string): WalletTransaction | null {
    const seller = this.users.find(u => u.id === sellerId && u.role === "seller")
    if (!seller || amount <= 0 || (seller.walletBalance || 0) < amount) return null
    
    seller.walletBalance = (seller.walletBalance || 0) - amount
    seller.totalWithdrawn = (seller.totalWithdrawn || 0) + amount
    
    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      sellerId,
      type: "adjustment",
      amount: -amount,
      note,
      createdBy: adminId,
      createdAt: new Date().toISOString(),
    }
    this.transactions.push(transaction)
    return transaction
  }

  addEarning(sellerId: string, amount: number, note: string): WalletTransaction | null {
    const seller = this.users.find(u => u.id === sellerId && u.role === "seller")
    if (!seller || amount <= 0) return null
    
    seller.walletBalance = (seller.walletBalance || 0) + amount
    seller.totalEarnings = (seller.totalEarnings || 0) + amount
    
    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      sellerId,
      type: "earning",
      amount,
      note,
      createdBy: "system",
      createdAt: new Date().toISOString(),
    }
    this.transactions.push(transaction)
    return transaction
  }
}

// Singleton
let storeInstance: Store | null = null
export function getStore(): Store {
  if (!storeInstance) storeInstance = new Store()
  return storeInstance
}
