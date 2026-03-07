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
    }).limit(100);

    let updated = 0;
    for (const product of sellerProducts) {
      // Set buyingPrice to 80% of selling price (assumes 20% profit margin)
      const estimatedBuyingPrice = product.price * 0.8;
      
      await Product.findByIdAndUpdate(product._id, {
        buyingPrice: estimatedBuyingPrice
      });
      
      updated++;
    }

    return Response.json({ 
      success: true, 
      message: `Updated ${updated} products with estimated buyingPrice`,
      updated 
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
