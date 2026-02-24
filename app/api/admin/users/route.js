import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return Response.json({ success: true, data: users });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
