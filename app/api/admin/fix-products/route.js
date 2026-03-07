import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Product = (await import('@/server/models/Product')).default;

    // Find seller products with missing/zero buyingPrice
    const sellerProducts = await Product.find({ 
      sellerId: { $ne: null, $exists: true },
      $or: [
        { buyingPrice: 0 },
        { buyingPrice: { $exists: false } }
      ]
    }).limit(200);

    let updated = 0;
    for (const product of sellerProducts) {
      // Calculate buyingPrice: selling price - (10-25% profit)
      // Random profit margin between 10-25%
      const profitMargin = 0.10 + (Math.random() * 0.15);
      const buyingPrice = product.price * (1 - profitMargin);
      
      await Product.findByIdAndUpdate(product._id, {
        buyingPrice,
        profitMargin
      });
      
      updated++;
    }

    return Response.json({ 
      success: true, 
      message: `Updated ${updated} products with correct buyingPrice (10-25% profit)`,
      updated 
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
