import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  try {
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    if (action === 'package') {
      await User.findByIdAndUpdate(body.id, { package: body.package });
      return Response.json({ success: true });
    }
    if (action === 'salesman') {
      await User.findByIdAndUpdate(body.id, { salesman: body.salesman });
      return Response.json({ success: true });
    }
    if (action === 'views') {
      await User.findByIdAndUpdate(body.id, { viewsBase: body.viewsBase, viewsInc: body.viewsInc });
      return Response.json({ success: true });
    }
    if (action === 'guarantee') {
      await User.findByIdAndUpdate(body.id, { guaranteeMoney: body.guaranteeMoney });
      return Response.json({ success: true });
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  try {
    const User = (await import('@/server/models/User')).default;
    
    if (action === 'balance') {
      await User.findByIdAndUpdate(body.id, { $inc: { walletBalance: body.amount } });
      return Response.json({ success: true });
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
