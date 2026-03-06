import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    const Product = (await import('@/server/models/Product')).default;
    const Order = (await import('@/server/models/Order')).default;
    const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
    
    const seller = await Seller.findById(id);
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    
    const userId = seller.userId;
    
    // Delete all seller's products
    await Product.deleteMany({ sellerId: userId });
    
    // Delete all seller's orders
    await Order.deleteMany({ sellerId: userId });
    
    // Delete all seller's wallet transactions
    await WalletTransaction.deleteMany({ userId: userId });
    
    // Delete seller record
    await Seller.findByIdAndDelete(id);
    
    // Delete user record
    await User.findByIdAndDelete(userId);
    
    return Response.json({ success: true, message: 'Seller and all data deleted' });
  } catch (error) {
    console.error('Delete seller error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
