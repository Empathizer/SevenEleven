import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const sellerId = searchParams.get('sellerId');

  try {
    if (action === 'dashboard') {
      const User = (await import('@/server/models/User')).default;
      const Order = (await import('@/server/models/Order')).default;
      const Product = (await import('@/server/models/Product')).default;
      
      const totalUsers = await User.countDocuments({ role: 'customer' });
      const totalSellers = await User.countDocuments({ role: 'seller' });
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
      
      return Response.json({
        success: true,
        data: {
          totalUsers,
          totalSellers,
          totalOrders,
          totalProducts,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      });
    }
    
    if (action === 'users') {
      const User = (await import('@/server/models/User')).default;
      if (id) {
        const user = await User.findById(id).select('-password');
        if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        return Response.json({ success: true, user });
      }
      const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
      return Response.json({ success: true, users });
    }
    
    if (action === 'sellers') {
      const User = (await import('@/server/models/User')).default;
      const Seller = (await import('@/server/models/Seller')).default;
      const sellers = await User.find({ role: 'seller' }).populate('sellerProfile').select('-password').sort({ createdAt: -1 });
      return Response.json({ success: true, sellers });
    }
    
    if (action === 'products') {
      const Product = (await import('@/server/models/Product')).default;
      const products = await Product.find().populate('sellerId', 'name').sort({ createdAt: -1 });
      return Response.json({ success: true, products });
    }
    
    if (action === 'categories') {
      const Category = (await import('@/server/models/Category')).default;
      const categories = await Category.find().sort({ createdAt: -1 });
      return Response.json({ success: true, categories });
    }
    
    if (action === 'orders') {
      const Order = (await import('@/server/models/Order')).default;
      const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
      return Response.json({ success: true, orders });
    }
    
    if (action === 'banners') {
      const Banner = (await import('@/server/models/Banner')).default;
      const banners = await Banner.find().sort({ createdAt: -1 });
      return Response.json({ success: true, banners });
    }
    
    if (action === 'wallet' && sellerId) {
      const User = (await import('@/server/models/User')).default;
      const seller = await User.findById(sellerId).select('walletBalance pendingBalance');
      if (!seller) return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
      return Response.json({ success: true, wallet: seller });
    }
    
    if (action === 'transactions' && sellerId) {
      const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
      const transactions = await WalletTransaction.find({ sellerId }).sort({ createdAt: -1 });
      return Response.json({ success: true, transactions });
    }
    
    if (action === 'stats' && sellerId) {
      const Order = (await import('@/server/models/Order')).default;
      const Product = (await import('@/server/models/Product')).default;
      
      const totalOrders = await Order.countDocuments({ 'items.sellerId': sellerId });
      const totalProducts = await Product.countDocuments({ sellerId });
      const totalRevenue = await Order.aggregate([
        { $unwind: '$items' },
        { $match: { 'items.sellerId': sellerId } },
        { $group: { _id: null, total: { $sum: '$items.price' } } }
      ]);
      
      return Response.json({
        success: true,
        stats: {
          totalOrders,
          totalProducts,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      });
    }
    
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

  try {
    if (action === 'category') {
      const Category = (await import('@/server/models/Category')).default;
      const category = await Category.create(body);
      return Response.json({ success: true, category });
    }
    
    if (action === 'banner') {
      const Banner = (await import('@/server/models/Banner')).default;
      const banner = await Banner.create(body);
      return Response.json({ success: true, banner });
    }
    
    if (action === 'deposit') {
      const User = (await import('@/server/models/User')).default;
      const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
      
      await User.findByIdAndUpdate(body.sellerId, {
        $inc: { walletBalance: body.amount }
      });
      
      await WalletTransaction.create({
        sellerId: body.sellerId,
        type: 'deposit',
        amount: body.amount,
        note: body.description || 'Admin deposit',
        createdBy: 'admin'
      });
      
      return Response.json({ success: true, message: 'Deposit added successfully' });
    }
    
    if (action === 'deduct') {
      const User = (await import('@/server/models/User')).default;
      const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
      
      await User.findByIdAndUpdate(body.sellerId, {
        $inc: { walletBalance: -body.amount }
      });
      
      await WalletTransaction.create({
        sellerId: body.sellerId,
        type: 'adjustment',
        amount: body.amount,
        note: body.description || 'Admin deduction',
        createdBy: 'admin'
      });
      
      return Response.json({ success: true, message: 'Amount deducted successfully' });
    }
    
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

  try {
    if (action === 'approve-seller') {
      const Seller = (await import('@/server/models/Seller')).default;
      await Seller.findByIdAndUpdate(body.sellerId, { status: 'approved' });
      return Response.json({ success: true, message: 'Seller approved successfully' });
    }
    
    if (action === 'reject-seller') {
      const Seller = (await import('@/server/models/Seller')).default;
      await Seller.findByIdAndUpdate(body.sellerId, { status: 'rejected' });
      return Response.json({ success: true, message: 'Seller rejected successfully' });
    }
    
    if (action === 'category') {
      const Category = (await import('@/server/models/Category')).default;
      const category = await Category.findByIdAndUpdate(body.id, body, { new: true });
      return Response.json({ success: true, category });
    }
    
    if (action === 'banner') {
      const Banner = (await import('@/server/models/Banner')).default;
      const banner = await Banner.findByIdAndUpdate(body.id, body, { new: true });
      return Response.json({ success: true, banner });
    }
    
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

  try {
    if (action === 'product') {
      const Product = (await import('@/server/models/Product')).default;
      await Product.findByIdAndDelete(id);
      return Response.json({ success: true, message: 'Product deleted successfully' });
    }
    
    if (action === 'category') {
      const Category = (await import('@/server/models/Category')).default;
      await Category.findByIdAndDelete(id);
      return Response.json({ success: true, message: 'Category deleted successfully' });
    }
    
    if (action === 'banner') {
      const Banner = (await import('@/server/models/Banner')).default;
      await Banner.findByIdAndDelete(id);
      return Response.json({ success: true, message: 'Banner deleted successfully' });
    }
    
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
