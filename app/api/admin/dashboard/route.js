import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    const Product = (await import('@/server/models/Product')).default;
    const Order = (await import('@/server/models/Order')).default;

    const [totalUsers, totalSellers, totalProducts, totalOrders, pendingSellers, salesResult] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'seller' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Seller.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);
    
    const totalSales = salesResult[0]?.total || 0;

    return Response.json({
      success: true,
      stats: { totalUsers, totalSellers, totalProducts, totalOrders, totalSales, pendingSellers }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
