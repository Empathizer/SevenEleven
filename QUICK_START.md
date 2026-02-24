# Quick Start Guide - Next.js API

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Your API is now running at `http://localhost:3000/api`

## 📝 Usage Examples

### Using the API Client (Recommended)

```javascript
import api from '@/lib/api-client';

// Login
const { user } = await api.login('admin@seveneleven.com', 'admin123');

// Get products
const { products } = await api.getProducts({ category: 'electronics' });

// Create order
const { order } = await api.createOrder({
  items: [...],
  shippingAddress: {...}
});

// Admin: Get dashboard
const { stats } = await api.getDashboard();
```

### Using Fetch Directly

```javascript
// Login
const response = await fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@seveneleven.com',
    password: 'admin123'
  })
});
const data = await response.json();

// Get products
const response = await fetch('/api/products?category=electronics');
const data = await response.json();

// Seller: Create product
const response = await fetch('/api/seller', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Product Name',
    price: 99.99,
    description: 'Product description',
    categoryId: '...',
    stock: 100
  })
});
const data = await response.json();
```

## 🔐 Authentication

Authentication is handled automatically via HTTP-only cookies. After login, all subsequent requests will include the auth cookie.

```javascript
// Login
await api.login('user@example.com', 'password');

// Now all requests are authenticated
const profile = await api.getSellerProfile();
const orders = await api.getSellerOrders();

// Logout
await api.logout();
```

## 📚 Common Operations

### Products
```javascript
// List all products
const products = await api.getProducts();

// Filter products
const products = await api.getProducts({
  category: 'electronics',
  minPrice: 100,
  maxPrice: 500,
  page: 1
});

// Get single product
const product = await api.getProduct(productId);

// Get categories
const categories = await api.getCategories();
```

### Seller Operations
```javascript
// Get profile
const profile = await api.getSellerProfile();

// Update profile
await api.updateSellerProfile({
  storeName: 'New Store Name',
  storeDescription: 'Description'
});

// Create product
const product = await api.createProduct({
  name: 'Product Name',
  price: 99.99,
  description: 'Description',
  categoryId: 'category-id',
  stock: 100,
  images: ['url1', 'url2']
});

// Get seller orders
const orders = await api.getSellerOrders();

// Get wallet balance
const wallet = await api.getSellerWallet();
```

### Orders
```javascript
// Create order (customer)
const order = await api.createOrder({
  items: [
    {
      productId: 'product-id',
      quantity: 2,
      price: 99.99
    }
  ],
  shippingAddress: {
    street: '123 Main St',
    city: 'City',
    state: 'State',
    zipCode: '12345',
    phone: '1234567890'
  },
  paymentMethod: 'COD'
});

// Get user orders
const orders = await api.getOrders();

// Get single order
const order = await api.getOrder(orderId);

// Update order status (admin/seller)
await api.updateOrderStatus(orderId, 'shipped');
```

### Admin Operations
```javascript
// Dashboard stats
const stats = await api.getDashboard();

// Manage users
const users = await api.getUsers();
const user = await api.getUser(userId);
await api.updateUser(userId, { status: 'active' });
await api.blockUser(userId);
await api.restoreUser(userId);

// Manage sellers
const sellers = await api.getSellers();
await api.approveSeller(sellerId);
await api.rejectSeller(sellerId);

// Manage categories
const categories = await api.getAdminCategories();
await api.createCategory({ name: 'New Category', slug: 'new-category' });
await api.updateCategory(categoryId, { name: 'Updated Name' });
await api.deleteCategory(categoryId);

// Manage banners
const banners = await api.getAdminBanners();
await api.createBanner({
  title: 'Banner Title',
  subtitle: 'Subtitle',
  image: 'image-url',
  link: '/products',
  isActive: true
});

// Seller wallet operations
const wallet = await api.getSellerWalletAdmin(sellerId);
await api.addDeposit(sellerId, 1000, 'Initial deposit');
await api.deductAmount(sellerId, 100, 'Fee deduction');

// Login as another user
await api.loginAsUser(userId);
```

## 🔧 Environment Variables

Make sure `.env.local` contains:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

### API returns 401 Unauthorized
- Make sure you're logged in
- Check if the auth cookie is being sent
- Verify JWT_SECRET in .env.local

### Database connection errors
- Verify MONGODB_URI in .env.local
- Check if MongoDB is accessible
- Ensure IP is whitelisted (for MongoDB Atlas)

### Route not found
- Check the API endpoint path
- Verify the HTTP method (GET, POST, PUT, DELETE)
- Check if action parameter is correct

## 📖 Full API Reference

See `API_MIGRATION.md` for complete API documentation and route mappings.

## 💡 Tips

1. **Use the API Client**: Import `api` from `@/lib/api-client` for type-safe API calls
2. **Error Handling**: All API methods throw errors on failure, use try-catch
3. **Authentication**: Cookies are handled automatically, no need to manage tokens
4. **Query Parameters**: Use objects for query params, they'll be converted to URL params

## 🎯 Next Steps

1. Update your frontend components to use the new API routes
2. Replace all `http://localhost:5000/api/*` with `/api/*`
3. Test all functionality
4. Deploy to production

---

**Need Help?** Check the full documentation in `API_MIGRATION.md` and `CONVERSION_COMPLETE.md`
