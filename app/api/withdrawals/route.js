import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const body = await req.json();
    const Seller = (await import('@/server/models/Seller')).default;
    const WithdrawalRequest = (await import('@/server/models/WithdrawalRequest')).default;
    
    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }

    if (seller.walletBalance < body.amount) {
      return Response.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
    }

    const withdrawal = await WithdrawalRequest.create({
      sellerId: seller._id,
      amount: body.amount
    });

    return Response.json({ success: true, data: withdrawal }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const WithdrawalRequest = (await import('@/server/models/WithdrawalRequest')).default;
    const filter = status ? { status } : {};

    const requests = await WithdrawalRequest.find(filter)
      .populate({
        path: 'sellerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort('-createdAt');

    return Response.json({ success: true, data: requests });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
