import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const User = (await import('@/server/models/User')).default;
    const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
    
    const seller = await User.findById(params.id);
    if (!seller || seller.role !== 'seller') {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }

    if (seller.walletBalance < body.amount) {
      return Response.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
    }

    seller.walletBalance = (seller.walletBalance || 0) - body.amount;
    seller.totalWithdrawn = (seller.totalWithdrawn || 0) + body.amount;
    await seller.save();

    const transaction = await WalletTransaction.create({
      sellerId: seller._id,
      type: 'adjustment',
      amount: -body.amount,
      note: body.note,
      createdBy: user.id
    });

    return Response.json({ 
      success: true, 
      transaction, 
      wallet: {
        walletBalance: seller.walletBalance,
        totalEarnings: seller.totalEarnings,
        totalWithdrawn: seller.totalWithdrawn
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
