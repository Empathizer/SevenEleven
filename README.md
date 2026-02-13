# SevenEleven Multi-Vendor E-Commerce Platform

A full-stack, production-ready multi-vendor e-commerce platform built with Next.js, Express, and MongoDB.

## Tech Stack

### Frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Shadcn/Radix UI
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Features

### User Roles
1. **Admin** - Full platform control
2. **Seller** - Manage store and products (requires KYC approval)
3. **Customer** - Browse, shop, and order

### Core Features
- JWT-based authentication with HTTP-only cookies
- Role-based access control
- Seller KYC registration and approval workflow
- Product management with categories
- Shopping cart and wishlist
- Order management system
- Seller wallet and transaction management
- Admin dashboard with analytics
- Responsive UI design

## Project Structure

```
e-commerce-platform-build/
├── app/                    # Next.js frontend
│   ├── admin/             # Admin panel pages
│   ├── seller/            # Seller dashboard pages
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   └── ...
├── components/            # React components
├── lib/                   # Utilities and contexts
├── server/                # Backend API
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & upload middleware
│   ├── config/           # Database config
│   └── server.js         # Express server
└── public/               # Static assets
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or pnpm

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/seveneleven
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Create uploads directory:
```bash
mkdir uploads
```

6. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Seller
- `GET /api/seller/profile` - Get seller profile
- `PUT /api/seller/profile` - Update seller profile
- `GET /api/seller/products` - Get seller products
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `GET /api/seller/orders` - Get seller orders
- `GET /api/seller/wallet` - Get wallet balance
- `GET /api/seller/transactions` - Get transactions

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/sellers` - Get all sellers
- `PUT /api/admin/sellers/:id/approve` - Approve seller
- `PUT /api/admin/sellers/:id/reject` - Reject seller
- `GET /api/admin/sellers/:sellerId/wallet` - Get seller wallet
- `POST /api/admin/sellers/:sellerId/deposit` - Add deposit
- `POST /api/admin/sellers/:sellerId/deduct` - Deduct amount
- `GET /api/admin/products` - Get all products
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/banners` - Get banners
- `POST /api/admin/banners` - Create banner
- `PUT /api/admin/banners/:id` - Update banner
- `DELETE /api/admin/banners/:id` - Delete banner

### Products (Public)
- `GET /api/products` - Get products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories

### Orders
- `POST /api/orders` - Create order (customer)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

## Database Models

### User
- name, email, password (hashed)
- role: admin | seller | customer
- status: active | pending | blocked
- walletBalance, totalEarnings, totalWithdrawn

### Seller
- userId (ref to User)
- storeName, storeDescription
- idType, idNumber, idImage
- address, invitationCode
- status: pending | approved | rejected

### Product
- name, description, price, originalPrice
- categoryId, sellerId
- images[], stock, rating, reviewCount, sold
- featured

### Category
- name, slug, image

### Order
- userId, items[], totalAmount
- status: pending | processing | shipped | delivered | cancelled
- paymentMethod, paymentStatus
- shippingAddress

### Banner
- title, subtitle, image, link, isActive

### WalletTransaction
- sellerId, type, amount, note, createdBy

## Default Credentials

After seeding the database, use these credentials:

**Admin:**
- Email: admin@seveneleven.com
- Password: admin123

**Seller:**
- Email: seller@seveneleven.com
- Password: seller123

**Customer:**
- Email: customer@seveneleven.com
- Password: customer123

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Render)
1. Push code to GitHub
2. Create new service
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update MONGODB_URI in .env

## Security Features
- Password hashing with bcrypt
- JWT tokens in HTTP-only cookies
- Role-based access control
- Protected API routes
- Input validation
- CORS configuration

## License
MIT

## Support
For issues and questions, please open an issue on GitHub.
