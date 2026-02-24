import {
  getDashboard,
  getUsers,
  getSellers,
  approveSeller,
  rejectSeller,
  getAllProducts,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getSellerWallet,
  addDeposit,
  deductAmount,
  getSellerTransactions,
  getSellerStats
} from '../../controllers/adminController';
import { protect, authorize } from '../../middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

// Middleware wrapper for Next.js
async function withAuth(req, handler, roles = []) {
  try {
    const authResult = await protect(req);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }
    
    if (roles.length > 0) {
      const authzResult = await authorize(roles)(req);
      if (!authzResult.success) {
        return NextResponse.json(authzResult, { status: 403 });
      }
    }
    
    return handler(req);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  return withAuth(req, async (req) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const sellerId = searchParams.get('sellerId');

    switch (action) {
      case 'dashboard':
        return getDashboard(req);
      case 'users':
        if (id) {
          const User = require('../../models/User');
          const user = await User.findById(id).select('-password');
          if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
          return NextResponse.json({ success: true, user });
        }
        return getUsers(req);
      case 'sellers':
        return getSellers(req);
      case 'seller-wallet':
        return getSellerWallet(req, sellerId);
      case 'seller-stats':
        return getSellerStats(req, sellerId);
      case 'seller-transactions':
        return getSellerTransactions(req, sellerId);
      case 'products':
        return getAllProducts(req);
      case 'categories':
        return getCategories(req);
      case 'orders':
        return getAllOrders(req);
      case 'banners':
        return getBanners(req);
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  }, ['admin']);
}

export async function POST(req) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const sellerId = searchParams.get('sellerId');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'categories':
        return createCategory(req, body);
      case 'banners':
        return createBanner(req, body);
      case 'deposit':
        return addDeposit(req, sellerId, body);
      case 'deduct':
        return deductAmount(req, sellerId, body);
      case 'login-as':
        const User = require('../../models/User');
        const jwt = require('jsonwebtoken');
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
          return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE
        });
        
        const response = NextResponse.json({ success: true, user });
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return response;
      case 'messages':
        const Message = require('../../models/Message');
        const message = await Message.create({
          senderId: req.user.id,
          receiverId: body.receiverId,
          message: body.message
        });
        return NextResponse.json({ success: true, message });
      case 'virtual-order':
        const Order = require('../../models/Order');
        const Product = require('../../models/Product');
        const { customerId, sellerId: orderSellerId, items, totalAmount, shippingAddress } = body;
        
        const order = await Order.create({
          userId: customerId,
          items: items.map(item => ({
            ...item,
            sellerId: orderSellerId,
            profit: (item.price - (item.buyingPrice || 0)) * item.quantity
          })),
          totalAmount,
          profit: items.reduce((sum, item) => sum + (item.price - (item.buyingPrice || 0)) * item.quantity, 0),
          shippingAddress,
          paymentMethod: 'COD',
          paymentStatus: 'paid',
          status: 'pending'
        });
        
        for (const item of items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { sold: item.quantity, stock: -item.quantity }
          });
        }
        
        const buyingCost = items.reduce((sum, item) => sum + (item.buyingPrice || 0) * item.quantity, 0);
        await User.findByIdAndUpdate(orderSellerId, {
          $inc: { 
            pendingBalance: totalAmount,
            walletBalance: -buyingCost
          }
        });
        
        return NextResponse.json({ success: true, order });
      case 'virtual-seller':
        const { name, email, password, storeName } = body;
        const Seller = require('../../models/Seller');
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }
        
        const newUser = await User.create({
          name,
          email,
          password,
          role: 'seller',
          status: 'active',
          isVirtual: true
        });
        
        const invitationCode = 'INV' + Math.random().toString(36).substr(2, 8).toUpperCase();
        
        await Seller.create({
          userId: newUser._id,
          storeName,
          status: 'approved',
          idType: 'CNIC',
          idNumber: 'N/A',
          idImage: 'N/A',
          address: 'Virtual Address',
          invitationCode
        });
        
        return NextResponse.json({ success: true, user: newUser, invitationCode });
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  }, ['admin']);
}

export async function PUT(req) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const sellerId = searchParams.get('sellerId');

    switch (action) {
      case 'user':
        const User = require('../../models/User');
        const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
        return NextResponse.json({ success: true, user });
      case 'user-restore':
        await User.findByIdAndUpdate(id, { status: 'active' });
        return NextResponse.json({ success: true, message: 'User restored' });
      case 'approve-seller':
        return approveSeller(req, id);
      case 'reject-seller':
        return rejectSeller(req, id);
      case 'seller-invitation':
        const Seller = require('../../models/Seller');
        const { invitationCode } = body;
        await Seller.findByIdAndUpdate(id, { invitationCode });
        return NextResponse.json({ success: true });
      case 'category':
        return updateCategory(req, id, body);
      case 'banner':
        return updateBanner(req, id, body);
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  }, ['admin']);
}

export async function DELETE(req) {
  return withAuth(req, async (req) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    switch (action) {
      case 'user':
        const User = require('../../models/User');
        await User.findByIdAndUpdate(id, { status: 'blocked' });
        return NextResponse.json({ success: true, message: 'User blocked' });
      case 'product':
        return deleteProduct(req, id);
      case 'category':
        return deleteCategory(req, id);
      case 'banner':
        return deleteBanner(req, id);
      case 'order':
        const Order = require('../../models/Order');
        await Order.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Order deleted' });
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  }, ['admin']);
}