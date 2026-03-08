import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Product = (await import('@/server/models/Product')).default;
    const products = await Product.find({ sellerId: user._id }).populate('categoryId');
    return Response.json({ success: true, data: products });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const body = await req.json();
    const Product = (await import('@/server/models/Product')).default;
    const User = (await import('@/server/models/User')).default;
    
    const seller = await User.findById(user._id);
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    
    if (seller.status === 'blocked') {
      return Response.json({ success: false, message: 'Your account is blocked. Cannot add products.' }, { status: 403 });
    }
    
    // Admin product price is the selling price
    const adminPrice = body.price || 0;
    
    // Calculate seller's buying price with random discount between 10-25%
    const profitMargin = 0.10 + (Math.random() * 0.15); // Random between 0.10 and 0.25
    const sellerBuyingPrice = adminPrice * (1 - profitMargin);

    // Create product with admin price as selling price and calculated buying price
    const product = await Product.create({ 
      ...body, 
      sellerId: user._id,
      price: adminPrice, // Selling price (same as admin price)
      buyingPrice: sellerBuyingPrice, // What seller pays
      profitMargin // Store the profit margin for reference
    });

    return Response.json({ 
      success: true, 
      product
    }, { status: 201 });
  } catch (error) {
    console.error('Seller add product error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
