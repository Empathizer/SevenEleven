import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const Category = (await import('@/server/models/Category')).default;
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
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
    const { id } = await params;
    const Category = (await import('@/server/models/Category')).default;
    const result = await Category.findByIdAndDelete(id);
    
    if (!result) {
      return Response.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
