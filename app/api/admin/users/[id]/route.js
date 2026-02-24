import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const User = (await import('@/server/models/User')).default;
    const user = await User.findById(id).select('-password');
    if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const User = (await import('@/server/models/User')).default;
    const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
    return Response.json({ success: true, user });
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
    const User = (await import('@/server/models/User')).default;
    await User.findByIdAndUpdate(id, { status: 'blocked' });
    return Response.json({ success: true, message: 'User blocked' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
