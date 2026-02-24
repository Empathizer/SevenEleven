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
    const User = (await import('@/server/models/User')).default;
    const seller = await User.findById(user.id);
    
    if (seller.walletBalance < amount) {
      return Response.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
    }

    const Withdrawal = (await import('@/server/models/Withdrawal')).default;
    await Withdrawal.create({
      sellerId: user.id,
      sellerName: seller.name,
      amount,
      status: 'pending'
    });

    return Response.json({ success: true, message: 'Withdrawal request submitted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
