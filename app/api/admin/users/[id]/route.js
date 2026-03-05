import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const User = (await import('@/server/models/User')).default;
    const user = await User.findById(id).select('-password');
    if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
    
    // Sync fields to Seller model if user is a seller
    if (user && user.role === 'seller') {
      const sellerFields = {};
      if (body.storeName !== undefined) sellerFields.storeName = body.storeName;
      if (body.storeDescription !== undefined) sellerFields.storeDescription = body.storeDescription;
      if (body.address !== undefined) sellerFields.address = body.address;
      if (body.idType !== undefined) sellerFields.idType = body.idType;
      if (body.idNumber !== undefined) sellerFields.idNumber = body.idNumber;
      if (body.idImage !== undefined) sellerFields.idImage = body.idImage;
      if (body.invitationCode !== undefined) sellerFields.invitationCode = body.invitationCode;
      if (body.walletBalance !== undefined) sellerFields.walletBalance = body.walletBalance;
      if (body.pendingBalance !== undefined) sellerFields.pendingBalance = body.pendingBalance;
      if (body.guaranteeMoney !== undefined) sellerFields.guaranteeMoney = body.guaranteeMoney;
      if (body.totalRecharge !== undefined) sellerFields.totalRecharge = body.totalRecharge;
      if (body.totalWithdrawn !== undefined) sellerFields.totalWithdrawn = body.totalWithdrawn;
      if (body.creditScore !== undefined) sellerFields.creditScore = body.creditScore;
      if (body.viewsBase !== undefined) sellerFields.viewsBase = body.viewsBase;
      if (body.viewsInc !== undefined) sellerFields.viewsInc = body.viewsInc;
      if (body.package !== undefined) sellerFields.package = body.package;
      if (body.salesman !== undefined) sellerFields.salesman = body.salesman;
      
      if (Object.keys(sellerFields).length > 0) {
        await Seller.findOneAndUpdate({ userId: id }, sellerFields);
      }
    }
    
    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const User = (await import('@/server/models/User')).default;
    await User.findByIdAndUpdate(id, { status: 'blocked' });
    return Response.json({ success: true, message: 'User blocked' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
