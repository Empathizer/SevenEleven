import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const Product = (await import('@/server/models/Product')).default;
    
    const [sellers, productCounts] = await Promise.all([
      Seller.find().populate('userId').lean(),
      Product.aggregate([
        { $match: { sellerId: { $ne: null } } },
        { $group: { _id: '$sellerId', count: { $sum: 1 } } }
      ])
    ]);
    
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
