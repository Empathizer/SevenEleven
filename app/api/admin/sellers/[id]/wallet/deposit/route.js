import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    
    if (!body.amount || body.amount <= 0) {
      return Response.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }
    
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
    
    const seller = await User.findById(id);
    if (!seller || seller.role !== 'seller') {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }

    console.log('Deposit - Before:', { walletBalance: seller.walletBalance, totalRecharge: seller.totalRecharge });

    // Update User model
    seller.walletBalance = (seller.walletBalance || 0) + body.amount;
    seller.totalRecharge = (seller.totalRecharge || 0) + body.amount;
    await seller.save();

    console.log('Deposit - After:', { walletBalance: seller.walletBalance, totalRecharge: seller.totalRecharge });

    // Sync to Seller model
    await Seller.findOneAndUpdate(
      { userId: id },
      { 
        walletBalance: seller.walletBalance,
        totalRecharge: seller.totalRecharge
      },
      { upsert: true }
    );

    const transaction = await WalletTransaction.create({
      sellerId: seller._id,
      type: 'deposit',
      amount: body.amount,
      note: body.note || 'Deposit',
      createdBy: user._id ? user._id.toString() : 'admin'
    });

    return Response.json({ 
      success: true, 
      transaction, 
      wallet: {
        walletBalance: seller.walletBalance,
        totalRecharge: seller.totalRecharge,
        totalWithdrawn: seller.totalWithdrawn || 0
      }
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
