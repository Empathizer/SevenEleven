import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { status, adminNote } = body;

  try {
    const Withdrawal = (await import('@/server/models/Withdrawal')).default;
    const withdrawal = await Withdrawal.findById(id);
    
    if (!withdrawal) {
      return Response.json({ success: false, message: 'Withdrawal not found' }, { status: 404 });
    }

    if (status === 'approved') {
      const User = (await import('@/server/models/User')).default;
      const seller = await User.findById(withdrawal.sellerId);
      
      if (seller.walletBalance < withdrawal.amount) {
        return Response.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
      }

      seller.walletBalance -= withdrawal.amount;
      seller.totalWithdrawn = (seller.totalWithdrawn || 0) + withdrawal.amount;
      await seller.save();
    }

    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    await withdrawal.save();

    return Response.json({ success: true, message: 'Withdrawal processed' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
