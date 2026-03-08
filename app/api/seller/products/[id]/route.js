import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const body = await req.json();
    const Product = (await import('@/server/models/Product')).default;
    const product = await Product.findOneAndUpdate(
      { _id: params.id, sellerId: user._id },
      body,
      { new: true }
    );
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return Response.json({ success: true, product });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Product = (await import('@/server/models/Product')).default;
    const product = await Product.findOneAndDelete({ _id: params.id, sellerId: user._id });
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
