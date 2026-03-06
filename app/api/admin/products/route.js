import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const Product = (await import('@/server/models/Product')).default;
    const query = sellerId ? { sellerId } : {};
    const products = await Product.find(query).populate('sellerId', 'name').populate('categoryId');
    return Response.json({ success: true, data: products });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const Product = (await import('@/server/models/Product')).default;
    const product = await Product.create(body);
    return Response.json({ success: true, data: product });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
