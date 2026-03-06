import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Product = (await import('@/server/models/Product')).default;
    const products = await Product.find({ sellerId: user.id }).populate('categoryId');
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
    
    const seller = await User.findById(user.id);
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    
    if (seller.status === 'blocked') {
      return Response.json({ success: false, message: 'Your account is blocked. Cannot add products.' }, { status: 403 });
    }
    
    // Calculate selling price with 10% profit margin
    const buyingPrice = body.buyingPrice || 0;
    const sellingPrice = buyingPrice * 1.1; // 10% profit

    // Create product with calculated selling price
    const product = await Product.create({ 
      ...body, 
      sellerId: user.id,
      price: sellingPrice,
      buyingPrice
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
