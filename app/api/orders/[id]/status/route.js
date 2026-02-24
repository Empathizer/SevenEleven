import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin', 'seller');
  if (error) return error;

  try {
    const body = await req.json();
    const Order = (await import('@/server/models/Order')).default;
    const order = await Order.findByIdAndUpdate(params.id, { status: body.status }, { new: true });
    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
