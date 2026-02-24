import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    const seller = await Seller.findByIdAndUpdate(params.id, { status: 'approved' }, { new: true });
    await User.findByIdAndUpdate(seller.userId, { status: 'active' });
    return Response.json({ success: true, seller });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
