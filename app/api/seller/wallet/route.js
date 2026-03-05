import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    const userData = await User.findById(user.id);
    const sellerData = await Seller.findOne({ userId: user.id });
    
    return Response.json({
      success: true,
      data: {
        walletBalance: userData.walletBalance || sellerData?.walletBalance || 0,
        pendingBalance: userData.pendingBalance || sellerData?.pendingBalance || 0,
        totalEarnings: userData.totalEarnings || 0,
        totalWithdrawn: userData.totalWithdrawn || sellerData?.totalWithdrawn || 0,
        guaranteeMoney: userData.guaranteeMoney || sellerData?.guaranteeMoney || 0,
        creditScore: userData.creditScore || sellerData?.creditScore || 100,
        viewsBase: userData.viewsBase || sellerData?.viewsBase || 0,
        viewsInc: userData.viewsInc || sellerData?.viewsInc || 0,
        package: userData.package || sellerData?.package || '',
        salesman: userData.salesman || sellerData?.salesman || '',
        storeName: sellerData?.storeName || userData.name,
        storeDescription: sellerData?.storeDescription || ''
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
