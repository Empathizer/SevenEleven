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
    const product = await Product.create({ ...body, sellerId: user.id });
    return Response.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
