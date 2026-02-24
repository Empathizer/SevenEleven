import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Product = (await import('@/server/models/Product')).default;
    await Product.findByIdAndDelete(params.id);
    return Response.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
