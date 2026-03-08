import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const Order = (await import('@/server/models/Order')).default;
    const order = await Order.findOne({ _id: params.id, userId: user._id })
      .populate('items.productId', 'name images');
    
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
