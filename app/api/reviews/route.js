import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    const Review = (await import('@/server/models/Review')).default;
    
    const reviews = await Review.find({ productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    
    return Response.json({ success: true, reviews });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'customer');
  if (error) return error;

  try {
    const body = await req.json();
    const Review = (await import('@/server/models/Review')).default;
    const Product = (await import('@/server/models/Product')).default;
    
    const existing = await Review.findOne({ productId: body.productId, userId: user._id });
    if (existing) {
      return Response.json({ success: false, message: 'You already reviewed this product' }, { status: 400 });
    }
    
    const review = await Review.create({
      ...body,
      userId: user._id
    });
    
    const reviews = await Review.find({ productId: body.productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(body.productId, {
      rating: avgRating.toFixed(1),
      reviewCount: reviews.length
    });
    
    return Response.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
