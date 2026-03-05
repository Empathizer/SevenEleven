import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    
    const seller = await Seller.findByIdAndUpdate(id, body, { new: true });
    
    // Sync fields to User model
    if (seller) {
      const userFields = {};
      if (body.walletBalance !== undefined) userFields.walletBalance = body.walletBalance;
      if (body.pendingBalance !== undefined) userFields.pendingBalance = body.pendingBalance;
      if (body.guaranteeMoney !== undefined) userFields.guaranteeMoney = body.guaranteeMoney;
      if (body.totalRecharge !== undefined) userFields.totalRecharge = body.totalRecharge;
      if (body.totalWithdrawn !== undefined) userFields.totalWithdrawn = body.totalWithdrawn;
      if (body.creditScore !== undefined) userFields.creditScore = body.creditScore;
      if (body.viewsBase !== undefined) userFields.viewsBase = body.viewsBase;
      if (body.viewsInc !== undefined) userFields.viewsInc = body.viewsInc;
      if (body.package !== undefined) userFields.package = body.package;
      if (body.salesman !== undefined) userFields.salesman = body.salesman;
      if (body.address !== undefined) userFields.address = body.address;
      
      if (Object.keys(userFields).length > 0) {
        await User.findByIdAndUpdate(seller.userId, userFields);
      }
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
