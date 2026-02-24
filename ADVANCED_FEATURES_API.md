# Advanced Features API Documentation

## Virtual Customers

### Generate Virtual Customers
```
POST /api/admin/virtual-customers/generate
Auth: Admin only
Body: {
  count: number (1-200),
  initialBalance: number,
  packageName: string
}
```

### Get Virtual Customers
```
GET /api/admin/virtual-customers
Auth: Admin only
```

### Login As User
```
POST /api/admin/virtual-customers/login-as/:id
Auth: Admin only
```

## Advanced Seller Management

### Set Seller Package
```
PUT /api/admin/sellers/:id/package
Auth: Admin only
Body: { packageName: string }
```

### Set Seller Salesman
```
PUT /api/admin/sellers/:id/salesman
Auth: Admin only
Body: { salesman: string }
```

### Set Seller Views
```
PUT /api/admin/sellers/:id/views
Auth: Admin only
Body: { viewsBase: number, viewsInc: number }
```

### Set Seller Guarantee
```
PUT /api/admin/sellers/:id/guarantee
Auth: Admin only
Body: { guaranteeMoney: number }
```

### Send Message to Seller
```
POST /api/admin/sellers/:id/message
Auth: Admin only
Body: { message: string }
```

### Adjust Seller Balance
```
POST /api/admin/sellers/:id/balance
Auth: Admin only
Body: { 
  amount: number, 
  type: 'deposit' | 'deduct',
  note: string 
}
```

## Advanced Order Management

### Get Orders with Filters
```
GET /api/admin/orders?deliveryStatus=Pending&page=1&limit=20
Auth: Admin only
Query params:
  - deliveryStatus: Pending | Confirmed | Picked Up | On The Way | Delivered | Cancel
  - paymentStatus: pending | paid | failed
  - isVirtual: true | false
  - page: number
  - limit: number
```

### Get Order by ID
```
GET /api/admin/orders/:id
Auth: Admin only
```

### Update Order Status
```
PUT /api/admin/orders/:id/status
Auth: Admin only
Body: {
  deliveryStatus?: string,
  pickupStatus?: string,
  paymentStatus?: string
}
```

### Delete Order
```
DELETE /api/admin/orders/:id
Auth: Admin only
```

### Generate Receipt PDF
```
GET /api/admin/orders/:id/receipt
Auth: Admin only
Returns: PDF file
```

## Withdrawal Requests

### Create Withdrawal Request (Seller)
```
POST /api/withdrawals
Auth: Seller only
Body: { amount: number }
```

### Get Withdrawal Requests (Admin)
```
GET /api/withdrawals?status=pending
Auth: Admin only
Query params:
  - status: pending | approved | rejected
```

### Process Withdrawal Request (Admin)
```
PUT /api/withdrawals/:id
Auth: Admin only
Body: {
  status: 'approved' | 'rejected',
  adminNote?: string
}
```

## Security Features

- Rate limiting: 100 requests per 15 minutes per IP
- Helmet.js security headers
- Admin audit logging for all actions
- JWT authentication with HTTP-only cookies

## Database Models

### User (Updated)
```javascript
{
  isVirtual: Boolean,
  package: String,
  phone: String
}
```

### Seller (Updated)
```javascript
{
  walletBalance: Number,
  pendingBalance: Number,
  guaranteeMoney: Number,
  totalRecharge: Number,
  totalWithdrawn: Number,
  creditScore: Number,
  viewsBase: Number,
  viewsInc: Number,
  package: String,
  salesman: String
}
```

### Order (Updated)
```javascript
{
  profit: Number,
  pickupStatus: 'Unpicked Up' | 'Picked Up',
  deliveryStatus: 'Pending' | 'Confirmed' | 'Picked Up' | 'On The Way' | 'Delivered' | 'Cancel',
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected',
  isVirtualOrder: Boolean
}
```

### WithdrawalRequest (New)
```javascript
{
  sellerId: ObjectId,
  amount: Number,
  status: 'pending' | 'approved' | 'rejected',
  adminNote: String,
  processedBy: ObjectId,
  processedAt: Date
}
```

### AdminAuditLog (New)
```javascript
{
  adminId: ObjectId,
  action: String,
  targetId: ObjectId,
  targetModel: String,
  details: Mixed,
  ipAddress: String,
  timestamps: true
}
```

## Business Logic

### Order Delivery Flow
1. Order created → profit added to seller's `pendingBalance`
2. Order status changed to "Delivered" → profit moved from `pendingBalance` to `walletBalance`

### Withdrawal Flow
1. Seller requests withdrawal (must have sufficient `walletBalance`)
2. Admin approves → amount deducted from `walletBalance`, added to `totalWithdrawn`
3. Admin rejects → no balance change

### Virtual Customer Orders
- Orders placed by virtual customers have `isVirtualOrder = true`
- Can be filtered separately in admin panel
