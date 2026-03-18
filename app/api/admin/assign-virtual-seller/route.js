import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/api-helper';

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    const Product = (await import('@/server/models/Product')).default;

    // Find or create virtual seller
    let virtualSeller = await User.findOne({ isVirtual: true, role: 'seller' });

    if (!virtualSeller) {
      virtualSeller = await User.create({
        name: 'SevenEleven Store',
        email: 'virtual-seller@seveneleven.com',
        password: 'VirtualSeller@123',
        role: 'seller',
        status: 'active',
        isVirtual: true,
        walletBalance: 0
      });

      await Seller.create({
        userId: virtualSeller._id,
        storeName: 'SevenEleven Store',
        storeDescription: 'Official SevenEleven Store',
        status: 'approved'
      });
    }

    // Assign all catalogue products (sellerId=null) to virtual seller
    const result = await Product.updateMany(
      { sellerId: null },
      { $set: { sellerId: virtualSeller._id } }
    );

    return Response.json({
      success: true,
      message: `${result.modifiedCount} products assigned to virtual seller`,
      virtualSellerId: virtualSeller._id
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
