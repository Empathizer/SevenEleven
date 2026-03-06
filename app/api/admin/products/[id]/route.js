import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const Product = (await import('@/server/models/Product')).default;
    
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, data: product });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const Product = (await import('@/server/models/Product')).default;
    await Product.findByIdAndDelete(id);
    return Response.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
