# 🚀 Quick Start Guide - Pure Next.js E-Commerce Platform

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Your `.env.local` is already configured with:
```env
MONGODB_URI=mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven
JWT_SECRET=kd93jf8s2mf9d3k4l5m6n7p8q9r0s1t2u3v4w5x6y7z8a1b2c3d4e5f6g7h8i9j0
JWT_EXPIRE=7d
NODE_ENV=development
NEXT_PUBLIC_API_URL=
```

### 3. Seed Database (Optional)
```bash
cd server
npm install
npm run seed
cd ..
```

### 4. Start Application
```bash
npm run dev
```

### 5. Access Application
Open http://localhost:3000

## Default Login Credentials

**Admin:**
- Email: admin@esellerstore.com
- Password: admin123

**Seller:**
- Email: seller@esellerstore.com
- Password: seller123

**Customer:**
- Email: customer@esellerstore.com
- Password: customer123

## API Endpoints

All API routes are now at `/api/*`:

### Public Routes
- `GET /api/products` - List products
- `GET /api/products/[id]` - Single product
- `GET /api/products/categories` - Categories
- `GET /api/banners` - Active banners

### Authentication
- `POST /api/auth/route` - Login/Register
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

### Customer Routes (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders` - My orders
- `GET /api/orders/[id]` - Single order

### Seller Routes (Protected)
- `GET /api/seller/profile` - Profile
- `GET /api/seller/products` - My products
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/[id]` - Update product
- `DELETE /api/seller/products/[id]` - Delete product
- `GET /api/seller/orders` - My orders
- `GET /api/seller/wallet` - Wallet balance
- `GET /api/seller/transactions` - Transactions

### Admin Routes (Protected)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - All users
- `GET /api/admin/sellers` - All sellers
- `PUT /api/admin/sellers/[id]/approve` - Approve seller
- `PUT /api/admin/sellers/[id]/reject` - Reject seller
- `POST /api/admin/sellers/[sellerId]/deposit` - Add funds
- `POST /api/admin/sellers/[sellerId]/deduct` - Deduct funds
- `GET /api/admin/products` - All products
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/categories` - Categories
- `POST /api/admin/categories` - Create category
- `GET /api/admin/orders` - All orders
- `GET /api/admin/banners` - Banners

## Project Structure

```
e-commerce-platform-build/
├── app/
│   ├── api/                    # ✨ NEW: All API routes here
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── seller/
│   │   ├── admin/
│   │   ├── banners/
│   │   ├── withdrawals/
│   │   └── messages/
│   ├── admin/                  # Admin pages
│   ├── seller/                 # Seller pages
│   ├── products/               # Product pages
│   └── ...
├── lib/
│   ├── api-helper.js          # ✨ NEW: Auth helpers
│   ├── auth-context.tsx       # ✨ UPDATED
│   └── ...
├── server/
│   ├── models/                # MongoDB models (still used)
│   └── ...
└── .env.local                 # ✨ UPDATED
```

## Features

✅ **Multi-vendor marketplace**
✅ **JWT authentication with HTTP-only cookies**
✅ **Role-based access control (Admin, Seller, Customer)**
✅ **Product management**
✅ **Order processing**
✅ **Seller wallet system**
✅ **Admin dashboard**
✅ **Responsive design**

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_EXPIRE
# - NODE_ENV=production
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check MONGODB_URI in `.env.local`
- Verify MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### API Not Working
- Clear browser cache
- Check browser console for errors
- Verify cookies are enabled
- Check terminal for API errors

## Testing

### Test Authentication
1. Go to http://localhost:3000/login
2. Login with default credentials
3. Check if redirected to dashboard

### Test Product Listing
1. Go to http://localhost:3000/products
2. Should see products from database

### Test Admin Panel
1. Login as admin
2. Go to http://localhost:3000/admin
3. Should see dashboard with stats

## What's Different from Express Version?

### Before (Express + Next.js)
- Two separate servers
- Express on port 5000
- Next.js on port 3000
- CORS configuration needed
- Two deployment processes

### After (Pure Next.js)
- Single Next.js application
- Everything on port 3000
- No CORS issues
- Single deployment
- Serverless-ready API routes

## Need Help?

Check these files:
- `CONVERSION_COMPLETE.md` - Full conversion details
- `README.md` - Original documentation
- `API.md` - API documentation

## Success! 🎉

Your application is now running as a pure Next.js app with no separate backend server!
