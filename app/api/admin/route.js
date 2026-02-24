import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  
  const controller = await import('@/server/controllers/adminController');
  
  const mockReq = { user, params: { id, sellerId: searchParams.get('sellerId') }, query: Object.fromEntries(searchParams) };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'dashboard') return await controller.getDashboard(mockReq, mockRes);
    if (action === 'users') {
      if (id) {
        const User = (await import('@/server/models/User')).default;
        const user = await User.findById(id).select('-password');
        if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        return Response.json({ success: true, user });
      }
      return await controller.getUsers(mockReq, mockRes);
    }
    if (action === 'sellers') return await controller.getSellers(mockReq, mockRes);
    if (action === 'products') return await controller.getAllProducts(mockReq, mockRes);
    if (action === 'categories') return await controller.getCategories(mockReq, mockRes);
    if (action === 'orders') return await controller.getAllOrders(mockReq, mockRes);
    if (action === 'banners') return await controller.getBanners(mockReq, mockRes);
    if (action === 'wallet') return await controller.getSellerWallet(mockReq, mockRes);
    if (action === 'transactions') return await controller.getSellerTransactions(mockReq, mockRes);
    if (action === 'stats') return await controller.getSellerStats(mockReq, mockRes);
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/adminController');
  
  const mockReq = { user, body, params: { sellerId: body.sellerId, userId: body.userId, id: body.id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data),
    cookie: (name, value, options) => {
      const { cookies } = require('next/headers');
      cookies().set(name, value, options);
    }
  };

  try {
    if (action === 'category') return await controller.createCategory(mockReq, mockRes);
    if (action === 'banner') return await controller.createBanner(mockReq, mockRes);
    if (action === 'deposit') return await controller.addDeposit(mockReq, mockRes);
    if (action === 'deduct') return await controller.deductAmount(mockReq, mockRes);
    if (action === 'message') {
      const Message = (await import('@/server/models/Message')).default;
      const message = await Message.create({
        senderId: user.id,
        receiverId: body.receiverId,
        message: body.message
      });
      return Response.json({ success: true, message });
    }
    if (action === 'login-as') {
      const User = (await import('@/server/models/User')).default;
      const jwt = (await import('jsonwebtoken')).default;
      const targetUser = await User.findById(body.userId).select('-password');
      if (!targetUser) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
      
      const token = jwt.sign({ id: targetUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
      
      const { cookies } = await import('next/headers');
      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      return Response.json({ success: true, user: targetUser });
    }
    if (action === 'virtual-order') {
      const Order = (await import('@/server/models/Order')).default;
      const Product = (await import('@/server/models/Product')).default;
      const User = (await import('@/server/models/User')).default;
      
      const { customerId, sellerId, items, totalAmount, shippingAddress } = body;
      
      const order = await Order.create({
        userId: customerId,
        items: items.map(item => ({
          ...item,
          sellerId,
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
      await User.findByIdAndUpdate(sellerId, {
        $inc: { 
          pendingBalance: totalAmount,
          walletBalance: -buyingCost
        }
      });
      
      return Response.json({ success: true, order });
    }
    if (action === 'virtual-seller') {
      const User = (await import('@/server/models/User')).default;
      const Seller = (await import('@/server/models/Seller')).default;
      
      const { name, email, password, storeName } = body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Response.json({ success: false, message: 'Email already exists' }, { status: 400 });
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
      
      return Response.json({ success: true, user: newUser, invitationCode });
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/adminController');
  
  const mockReq = { user, body, params: { id: body.id, sellerId: body.sellerId } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'approve-seller') return await controller.approveSeller(mockReq, mockRes);
    if (action === 'reject-seller') return await controller.rejectSeller(mockReq, mockRes);
    if (action === 'category') return await controller.updateCategory(mockReq, mockRes);
    if (action === 'banner') return await controller.updateBanner(mockReq, mockRes);
    if (action === 'user') {
      const User = (await import('@/server/models/User')).default;
      const updatedUser = await User.findByIdAndUpdate(body.id, body, { new: true }).select('-password');
      return Response.json({ success: true, user: updatedUser });
    }
    if (action === 'restore-user') {
      const User = (await import('@/server/models/User')).default;
      await User.findByIdAndUpdate(body.id, { status: 'active' });
      return Response.json({ success: true, message: 'User restored' });
    }
    if (action === 'invitation') {
      const Seller = (await import('@/server/models/Seller')).default;
      await Seller.findByIdAndUpdate(body.id, { invitationCode: body.invitationCode });
      return Response.json({ success: true });
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  
  const controller = await import('@/server/controllers/adminController');
  
  const mockReq = { user, params: { id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'product') return await controller.deleteProduct(mockReq, mockRes);
    if (action === 'category') return await controller.deleteCategory(mockReq, mockRes);
    if (action === 'banner') return await controller.deleteBanner(mockReq, mockRes);
    if (action === 'user') {
      const User = (await import('@/server/models/User')).default;
      await User.findByIdAndUpdate(id, { status: 'blocked' });
      return Response.json({ success: true, message: 'User blocked' });
    }
    if (action === 'order') {
      const Order = (await import('@/server/models/Order')).default;
      await Order.findByIdAndDelete(id);
      return Response.json({ success: true, message: 'Order deleted' });
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
