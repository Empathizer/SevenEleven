import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    const Product = (await import('@/server/models/Product')).default;
    
    const [sellers, productCounts] = await Promise.all([
      Seller.find().populate('userId').lean(),
      Product.aggregate([
        { $match: { sellerId: { $ne: null } } },
        { $group: { _id: '$sellerId', count: { $sum: 1 } } }
      ])
    ]);
    
    // Auto-sync: Update Seller model with User model data
    for (const seller of sellers) {
      if (seller.userId && seller.userId._id) {
        await Seller.findByIdAndUpdate(seller._id, {
          walletBalance: seller.userId.walletBalance || 0,
          pendingBalance: seller.userId.pendingBalance || 0,
          totalRecharge: seller.userId.totalRecharge || 0,
          totalWithdrawn: seller.userId.totalWithdrawn || 0
        });
      }
    }
    
    const countMap = Object.fromEntries(productCounts.map(p => [p._id.toString(), p.count]));
    const sellersWithCounts = sellers.map(s => ({ ...s, productCount: countMap[s.userId?._id?.toString()] || 0 }));
    
    return Response.json({ success: true, data: sellersWithCounts }, {
      headers: {
        'Cache-Control': 'private, max-age=10'
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
