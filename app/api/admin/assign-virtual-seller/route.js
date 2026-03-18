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

    const storeNames = [
      { name: 'Alex Carter', store: 'Carter Deals' },
      { name: 'Maria Lopez', store: 'Lopez Mart' },
      { name: 'James Wilson', store: 'Wilson Shop' }
    ];

    const virtualSellers = [];

    for (const s of storeNames) {
      let existing = await User.findOne({ email: `${s.store.toLowerCase().replace(/ /g, '.')}@store.com`, isVirtual: true, role: 'seller' });
      
      if (!existing) {
        existing = await User.create({
          name: s.name,
          email: `${s.store.toLowerCase().replace(/ /g, '.')}@store.com`,
          password: 'Virtual@123',
          role: 'seller',
          status: 'active',
          isVirtual: true,
          walletBalance: 0
        });

        await Seller.create({
          userId: existing._id,
          storeName: s.store,
          storeDescription: `Welcome to ${s.store}`,
          status: 'approved'
        });
      }

      virtualSellers.push(existing);
    }

    // Get all catalogue products (sellerId=null) OR already assigned to virtual sellers
    const virtualSellerIds = virtualSellers.map(s => s._id);
    const products = await Product.find({
      $or: [
        { sellerId: null },
        { sellerId: { $in: virtualSellerIds } }
      ]
    });

    console.log('Total products to distribute:', products.length);

    // Distribute products evenly among 3 virtual sellers
    for (let i = 0; i < products.length; i++) {
      const seller = virtualSellers[i % 3];
      await Product.findByIdAndUpdate(products[i]._id, { sellerId: seller._id });
    }

    return Response.json({
      success: true,
      message: `${products.length} products distributed among 3 virtual sellers`,
      sellers: virtualSellers.map(s => ({ id: s._id, name: s.name }))
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
