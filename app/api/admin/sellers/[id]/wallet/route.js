import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const user = await User.findById(params.id);
    if (!user || user.role !== 'seller') {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    return Response.json({
      success: true,
      wallet: {
        walletBalance: user.walletBalance || 0,
        totalEarnings: user.totalEarnings || 0,
        totalWithdrawn: user.totalWithdrawn || 0
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
