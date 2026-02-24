import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const Category = (await import('@/server/models/Category')).default;
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
    return Response.json({ success: true, category });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Category = (await import('@/server/models/Category')).default;
    await Category.findByIdAndDelete(params.id);
    return Response.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
