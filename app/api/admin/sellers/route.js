import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const sellers = await Seller.find().populate('userId');
    return Response.json({ success: true, data: sellers });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
