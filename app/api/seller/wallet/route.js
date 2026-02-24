import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const userData = await User.findById(user.id);
    return Response.json({
      success: true,
      data: {
        walletBalance: userData.walletBalance || 0,
        pendingBalance: userData.pendingBalance || 0,
        totalEarnings: userData.totalEarnings || 0,
        totalWithdrawn: userData.totalWithdrawn || 0
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
