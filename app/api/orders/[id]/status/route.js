import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  try {
    const Order = (await import('@/server/models/Order')).default;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
