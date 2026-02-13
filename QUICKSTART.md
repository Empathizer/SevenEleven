# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from https://www.mongodb.com/try/download/community

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/seveneleven
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Seed the database:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```

Backend running at: http://localhost:5000

### Step 3: Setup Frontend

Open new terminal:
```bash
cd ..
npm install
npm run dev
```

Frontend running at: http://localhost:3000

### Step 4: Login

Visit http://localhost:3000/login

**Admin Account:**
- Email: admin@seveneleven.com
- Password: admin123

**Seller Account:**
- Email: seller@seveneleven.com
- Password: seller123

**Customer Account:**
- Email: customer@seveneleven.com
- Password: customer123

## 📁 Project Structure

```
e-commerce-platform-build/
├── app/                    # Next.js pages
│   ├── admin/             # Admin dashboard
│   ├── seller/            # Seller dashboard
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   └── ...
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── ...
├── lib/                   # Utilities
│   ├── auth-context.tsx  # Authentication
│   ├── cart-context.tsx  # Cart management
│   └── store.ts          # In-memory store (demo)
├── server/                # Backend API
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload
│   ├── config/          # Database config
│   ├── server.js        # Express server
│   └── seed.js          # Database seeder
└── public/              # Static files
```

## 🔑 Key Features

### For Admin
- Dashboard with analytics
- Approve/reject sellers
- Manage all products
- Manage categories
- Manage orders
- Manage banners
- Seller wallet management

### For Sellers
- Register with KYC
- Manage products
- View orders
- Track earnings
- Wallet management

### For Customers
- Browse products
- Search & filter
- Add to cart
- Wishlist
- Place orders
- Track orders

## 🛠️ Development Tips

### Testing API Endpoints

Use Postman or curl:

```bash
# Register new user
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
  -d '{
    "email": "admin@seveneleven.com",
    "password": "admin123"
  }'

# Get products
curl http://localhost:5000/api/products
```

### Database Management

View data in MongoDB:
```bash
mongosh
use seveneleven
db.users.find()
db.products.find()
db.orders.find()
```

Reset database:
```bash
cd server
npm run seed
```

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection error:**
- Ensure MongoDB is running: `brew services list`
- Check connection string in .env
- Try: `mongosh` to test connection

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Next Steps

1. **Customize Design**: Edit Tailwind config and components
2. **Add Features**: Implement reviews, ratings, chat
3. **Integrate Payment**: Add Stripe or PayPal
4. **Add Email**: Implement email notifications
5. **Deploy**: Follow DEPLOYMENT.md guide

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

## 💡 Pro Tips

- Use MongoDB Compass for visual database management
- Install Thunder Client (VS Code) for API testing
- Enable hot reload for faster development
- Use React DevTools for debugging
- Check browser console for errors

## 🆘 Need Help?

- Check README.md for detailed documentation
- Review API endpoints in route files
- Examine controller files for business logic
- Test with default credentials first
- Check server logs for errors

Happy coding! 🎉
