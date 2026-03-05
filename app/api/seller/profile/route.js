import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    
    const seller = await Seller.findOne({ userId: user.id });
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    
    // Merge data from both User and Seller models
    const userData = await User.findById(user.id);
    const sellerData = seller.toObject();
    
    // Prioritize User model for financial and account data
    sellerData.walletBalance = userData.walletBalance || 0;
    sellerData.pendingBalance = userData.pendingBalance || 0;
    sellerData.totalEarnings = userData.totalEarnings || 0;
    sellerData.totalWithdrawn = userData.totalWithdrawn || 0;
    sellerData.guaranteeMoney = userData.guaranteeMoney || sellerData.guaranteeMoney || 0;
    sellerData.creditScore = userData.creditScore || sellerData.creditScore || 100;
    sellerData.viewsBase = userData.viewsBase || sellerData.viewsBase || 0;
    sellerData.viewsInc = userData.viewsInc || sellerData.viewsInc || 0;
    sellerData.package = userData.package || sellerData.package || '';
    sellerData.salesman = userData.salesman || sellerData.salesman || '';
    sellerData.phone = userData.phone || '';
    sellerData.address = userData.address || sellerData.address || '';
    sellerData.commentPermission = userData.commentPermission || 'enabled';
    sellerData.homeDisplay = userData.homeDisplay || 'show';
    sellerData.totalRecharge = userData.totalRecharge || sellerData.totalRecharge || 0;
    
    return Response.json({ success: true, data: sellerData });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const body = await req.json();
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    
    // Update Seller model
    const seller = await Seller.findOneAndUpdate(
      { userId: user.id },
      { storeName: body.storeName, storeDescription: body.storeDescription },
      { new: true }
    );
    
    // Sync storeName to User model if provided
    if (body.storeName) {
      await User.findByIdAndUpdate(user.id, { name: body.storeName });
    }
    
    return Response.json({ success: true, data: seller });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
