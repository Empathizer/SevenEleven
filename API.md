# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require JWT token in:
- Cookie: `token`
- OR Header: `Authorization: Bearer <token>`

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "storeName": "My Store",
  "storeDescription": "Store description",
  "idType": "CNIC",
  "idNumber": "12345-1234567-1",
  "idImage": "https://example.com/id.jpg",
  "address": "123 Street, City",
  "invitationCode": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "status": "active"
  },
  "token": "jwt_token_here"
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "admin@seveneleven.com",
  "password": "admin123"
}
```

### Get Current User
```http
GET /auth/me
```
**Auth Required:** Yes

### Logout
```http
POST /auth/logout
```

---

## Seller Endpoints

**Auth Required:** Yes (Seller role)

### Get Seller Profile
```http
GET /seller/profile
```

### Update Seller Profile
```http
PUT /seller/profile
```

**Body:**
```json
{
  "storeName": "Updated Store Name",
  "storeDescription": "Updated description"
}
```

### Get Seller Products
```http
GET /seller/products
```

### Create Product
```http
POST /seller/products
```

**Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "originalPrice": 149.99,
  "categoryId": "category_id_here",
  "images": ["https://example.com/image1.jpg"],
  "stock": 100,
  "featured": false
}
```

### Update Product
```http
PUT /seller/products/:id
```

### Delete Product
```http
DELETE /seller/products/:id
```

### Get Seller Orders
```http
GET /seller/orders
```

### Get Wallet
```http
GET /seller/wallet
```

**Response:**
```json
{
  "success": true,
  "wallet": {
    "walletBalance": 1250.50,
    "totalEarnings": 3500.00,
    "totalWithdrawn": 2249.50
  }
}
```

### Get Transactions
```http
GET /seller/transactions
```

---

## Admin Endpoints

**Auth Required:** Yes (Admin role)

### Get Dashboard Stats
```http
GET /admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 100,
    "totalSellers": 25,
    "totalProducts": 500,
    "totalOrders": 1000,
    "totalSales": 50000.00,
    "pendingSellers": 5
  }
}
```

### Get All Users
```http
GET /admin/users
```

### Get All Sellers
```http
GET /admin/sellers
```

### Approve Seller
```http
PUT /admin/sellers/:id/approve
```

### Reject Seller
```http
PUT /admin/sellers/:id/reject
```

**Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

### Get Seller Wallet
```http
GET /admin/sellers/:sellerId/wallet
```

### Add Deposit to Seller
```http
POST /admin/sellers/:sellerId/deposit
```

**Body:**
```json
{
  "amount": 500.00,
  "note": "Bonus payment"
}
```

### Deduct from Seller
```http
POST /admin/sellers/:sellerId/deduct
```

**Body:**
```json
{
  "amount": 100.00,
  "note": "Penalty for policy violation"
}
```

### Get Seller Transactions
```http
GET /admin/sellers/:sellerId/transactions
```

### Get All Products
```http
GET /admin/products
```

### Delete Product
```http
DELETE /admin/products/:id
```

### Get Categories
```http
GET /admin/categories
```

### Create Category
```http
POST /admin/categories
```

**Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "image": "https://example.com/category.jpg"
}
```

### Update Category
```http
PUT /admin/categories/:id
```

### Delete Category
```http
DELETE /admin/categories/:id
```

### Get All Orders
```http
GET /admin/orders
```

### Get Banners
```http
GET /admin/banners
```

### Create Banner
```http
POST /admin/banners
```

**Body:**
```json
{
  "title": "Summer Sale",
  "subtitle": "Up to 50% off",
  "image": "https://example.com/banner.jpg",
  "link": "/products",
  "isActive": true
}
```

### Update Banner
```http
PUT /admin/banners/:id
```

### Delete Banner
```http
DELETE /admin/banners/:id
```

---

## Product Endpoints (Public)

### Get Products
```http
GET /products?category=jewelry&search=necklace&featured=true&page=1&limit=20
```

**Query Parameters:**
- `category` - Filter by category slug
- `search` - Search in name and description
- `featured` - Filter featured products (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "products": [...],
  "totalPages": 5,
  "currentPage": 1
}
```

### Get Single Product
```http
GET /products/:id
```

### Get Categories
```http
GET /products/categories
```

---

## Order Endpoints

**Auth Required:** Yes

### Create Order
```http
POST /orders
```

**Auth Required:** Customer role

**Body:**
```json
{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main St, City, Country",
  "paymentMethod": "COD"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "...",
    "userId": "...",
    "items": [...],
    "totalAmount": 199.98,
    "status": "pending",
    "paymentMethod": "COD",
    "paymentStatus": "pending",
    "shippingAddress": "...",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get User Orders
```http
GET /orders
```

### Get Single Order
```http
GET /orders/:id
```

### Update Order Status
```http
PUT /orders/:id/status
```

**Auth Required:** Admin or Seller

**Body:**
```json
{
  "status": "shipped"
}
```

**Status Options:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Role seller is not authorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Testing with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use token in subsequent requests
curl http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Create Product (Seller)
```bash
curl -X POST http://localhost:5000/api/seller/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "categoryId": "CATEGORY_ID",
    "images": ["https://example.com/image.jpg"],
    "stock": 50
  }'
```

### Place Order (Customer)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 1
      }
    ],
    "shippingAddress": "123 Main St",
    "paymentMethod": "COD"
  }'
```

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

## CORS

Configured to accept requests from:
- `http://localhost:3000` (development)
- Your production frontend URL

## Security Headers

Recommended headers for production:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

---

For more information, check the controller files in `/server/controllers/`
