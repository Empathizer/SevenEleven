import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Order = (await import('@/server/models/Order')).default;
    const orders = await Order.find().populate('userId', 'name email').sort('-createdAt').limit(50);
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
