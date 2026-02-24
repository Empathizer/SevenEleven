import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Order = (await import('@/server/models/Order')).default;
    const orders = await Order.find({ 'items.sellerId': user.id })
      .populate('userId', 'name email')
      .sort('-createdAt');
    return Response.json({ success: true, data: orders });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
