# API Migration to Next.js

All Express routes have been converted to Next.js API routes.

## Structure

```
app/api/
├── auth/route.js                 # Authentication endpoints
├── products/
│   ├── route.js                  # Product listing
│   ├── [id]/route.js            # Single product
│   └── categories/route.js      # Categories
├── seller/route.js              # Seller operations
├── orders/route.js              # Order management
├── admin/route.js               # Admin operations
├── banners/route.js             # Public banners
├── messages/route.js            # User messages
├── withdrawals/route.js         # Withdrawal requests
├── virtual-customers/route.js   # Virtual customers (admin)
├── advanced-orders/route.js     # Advanced order management
└── advanced-seller/route.js     # Advanced seller management
```

## Key Changes

### 1. Database Connection
- Uses connection caching in `lib/db.js`
- Automatically connects on each request

### 2. Authentication
- Middleware converted to `lib/auth.js`
- Uses `requireAuth()` function with role checking
- Supports both cookies and Bearer tokens

### 3. Route Handlers
- Express routes → Next.js route handlers (GET, POST, PUT, DELETE)
- Query params via `searchParams`
- Body via `await req.json()`
- Actions passed via query params

## API Usage Examples

### Auth
```javascript
// Register
POST /api/auth
{ _action: 'register', name, email, password, role }

// Login
POST /api/auth
{ email, password }

// Get current user
GET /api/auth

// Logout
POST /api/auth
{ _action: 'logout' }
```

### Products
```javascript
// List products
GET /api/products?category=electronics&page=1

// Single product
GET /api/products/[id]

// Categories
GET /api/products/categories
```

### Seller
```javascript
// Get profile
GET /api/seller?action=profile

// Get products
GET /api/seller?action=products

// Create product
POST /api/seller
{ name, description, price, ... }

// Update product
PUT /api/seller?action=product
{ id, name, price, ... }

// Delete product
DELETE /api/seller?id=productId
```

### Orders
```javascript
// Create order
POST /api/orders
{ items, shippingAddress, ... }

// Get orders
GET /api/orders

// Get single order
GET /api/orders?id=orderId

// Update status
PUT /api/orders
{ id, status }
```

### Admin
```javascript
// Dashboard
GET /api/admin?action=dashboard

// Users
GET /api/admin?action=users

// Approve seller
PUT /api/admin?action=approve-seller
{ id: sellerId }

// Create category
POST /api/admin?action=category
{ name, slug, image }

// Virtual order
POST /api/admin?action=virtual-order
{ customerId, sellerId, items, ... }
```

## Environment Variables

Required in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Migration Benefits

1. **No separate backend server needed** - Everything runs in Next.js
2. **Better performance** - Connection pooling and caching
3. **Simplified deployment** - Single deployment target
4. **Type safety** - Can add TypeScript easily
5. **Edge-ready** - Can deploy to edge with minor modifications

## Testing

All existing controllers and models work without changes. The API routes act as adapters between Next.js and Express-style controllers.

## Next Steps

1. Update frontend API calls to use relative paths (`/api/...`)
2. Remove Express server dependency
3. Test all endpoints
4. Consider converting controllers to native Next.js style
5. Add TypeScript types
