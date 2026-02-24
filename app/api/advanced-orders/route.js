import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  try {
    const Order = (await import('@/server/models/Order')).default;
    
    if (id) {
      const order = await Order.findById(id).populate('userId', 'name email');
      return Response.json({ success: true, order });
    } else {
      const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
      return Response.json({ success: true, orders });
    }
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  
  try {
    const Order = (await import('@/server/models/Order')).default;
    const order = await Order.findByIdAndUpdate(body.id, { status: body.status }, { new: true });
    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  try {
    const Order = (await import('@/server/models/Order')).default;
    await Order.findByIdAndDelete(id);
    return Response.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
