import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const WithdrawalRequest = (await import('@/server/models/WithdrawalRequest')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    const withdrawal = await WithdrawalRequest.findById(params.id);
    if (!withdrawal) {
      return Response.json({ success: false, message: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return Response.json({ success: false, message: 'Already processed' }, { status: 400 });
    }

    withdrawal.status = body.status;
    withdrawal.adminNote = body.adminNote;
    withdrawal.processedBy = user._id;
    withdrawal.processedAt = new Date();

    if (body.status === 'approved') {
      const seller = await Seller.findById(withdrawal.sellerId);
      if (seller.walletBalance < withdrawal.amount) {
        return Response.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
      }
      seller.walletBalance -= withdrawal.amount;
      seller.totalWithdrawn += withdrawal.amount;
      await seller.save();
    }

    await withdrawal.save();
    return Response.json({ success: true, data: withdrawal });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
