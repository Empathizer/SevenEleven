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

    // Get all admin catalogue products (sellerId=null)
    const catalogueProducts = await Product.find({ sellerId: null }).lean();

    console.log('Catalogue products found:', catalogueProducts.length);

    let cloned = 0;

    for (let i = 0; i < catalogueProducts.length; i++) {
      const seller = virtualSellers[i % 3];
      const original = catalogueProducts[i];

      // Check if this product is already cloned for this seller
      const exists = await Product.findOne({
        name: original.name,
        sellerId: seller._id
      });

      if (!exists) {
        const { _id, createdAt, updatedAt, ...rest } = original;
        await Product.create({
          ...rest,
          sellerId: seller._id,
          buyingPrice: original.price,
          price: parseFloat((original.price * 1.1).toFixed(2))
        });
        cloned++;
      }
    }

    return Response.json({
      success: true,
      message: `${cloned} products cloned to 3 virtual sellers. Admin catalogue unchanged.`,
      sellers: virtualSellers.map(s => ({ id: s._id, name: s.name }))
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
