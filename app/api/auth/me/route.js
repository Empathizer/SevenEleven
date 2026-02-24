import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    let sellerInfo = null;
    if (user.role === 'seller') {
      sellerInfo = await Seller.findOne({ userId: user._id });
    }

    return Response.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        walletBalance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        totalWithdrawn: user.totalWithdrawn,
        storeName: sellerInfo?.storeName,
        seller: sellerInfo
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
