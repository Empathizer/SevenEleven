#!/bin/bash

echo "🚀 SevenEleven E-Commerce - Next.js API Setup"
echo "=============================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ Environment file (.env.local) found"
else
    echo "❌ Environment file (.env.local) not found"
    echo "   Please create .env.local with required variables"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed"
    echo "   Running: npm install"
    npm install
fi

echo ""
echo "📁 API Structure:"
echo "   app/api/"
echo "   ├── auth/              ✅ Authentication"
echo "   ├── products/          ✅ Products & Categories"
echo "   ├── seller/            ✅ Seller Operations"
echo "   ├── orders/            ✅ Order Management"
echo "   ├── admin/             ✅ Admin Operations"
echo "   ├── banners/           ✅ Banners"
echo "   ├── messages/          ✅ Messaging"
echo "   ├── withdrawals/       ✅ Withdrawals"
echo "   ├── virtual-customers/ ✅ Virtual Customers"
echo "   ├── advanced-orders/   ✅ Advanced Orders"
echo "   └── advanced-seller/   ✅ Advanced Seller"
echo ""

echo "🔧 Utilities:"
echo "   lib/db.js              ✅ Database Connection"
echo "   lib/auth.js            ✅ Authentication Middleware"
echo "   lib/api-client.js      ✅ Frontend API Client"
echo ""

echo "📚 Documentation:"
echo "   README_API.md          ✅ Main API Documentation"
echo "   QUICK_START.md         ✅ Quick Start Guide"
echo "   API_MIGRATION.md       ✅ Detailed API Reference"
echo "   CONVERSION_COMPLETE.md ✅ Conversion Details"
echo ""

echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "   1. Run: npm run dev"
echo "   2. API will be available at: http://localhost:3000/api"
echo "   3. Test endpoints using the examples in QUICK_START.md"
echo "   4. Use the API client: import api from '@/lib/api-client'"
echo ""
echo "📖 Read QUICK_START.md for usage examples"
echo ""
