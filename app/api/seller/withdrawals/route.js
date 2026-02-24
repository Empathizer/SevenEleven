import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Withdrawal = (await import('@/server/models/Withdrawal')).default;
    const withdrawals = await Withdrawal.find({ sellerId: user.id }).sort({ createdAt: -1 });
    return Response.json({ success: true, withdrawals });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  const body = await req.json();
  const { amount } = body;

  if (!amount || amount <= 0) {
    return Response.json({ success: false, message: 'Invalid amount' }, { status: 400 });
  }

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const seller = await Seller.findOne({ userId: user.id }).populate('userId');
    
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    
    if (seller.walletBalance < amount) {
      return Response.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
    }

    const Withdrawal = (await import('@/server/models/Withdrawal')).default;
    await Withdrawal.create({
      sellerId: user.id,
      sellerName: seller.storeName || seller.userId.name,
      amount,
      status: 'pending'
    });

    return Response.json({ success: true, message: 'Withdrawal request submitted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
