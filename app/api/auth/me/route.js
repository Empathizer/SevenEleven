import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    
    const userData = await User.findById(user._id).select('-password').lean();
    let sellerInfo = null;
    
    if (user.role === 'seller') {
      sellerInfo = await Seller.findOne({ userId: user._id }).lean();
    }

    return Response.json({
      success: true,
      data: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        walletBalance: userData.walletBalance || 0,
        pendingBalance: userData.pendingBalance || 0,
        totalEarnings: userData.totalEarnings || 0,
        totalWithdrawn: userData.totalWithdrawn || 0,
        guaranteeMoney: userData.guaranteeMoney || 0,
        creditScore: userData.creditScore || 100,
        viewsBase: userData.viewsBase || 0,
        viewsInc: userData.viewsInc || 0,
        package: userData.package || '',
        salesman: userData.salesman || '',
        phone: userData.phone || '',
        storeName: userData.storeName || sellerInfo?.storeName || '',
        storeDescription: userData.storeDescription || sellerInfo?.storeDescription || '',
        seller: sellerInfo
      }
    }, {
      headers: {
        'Cache-Control': 'private, max-age=60'
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
