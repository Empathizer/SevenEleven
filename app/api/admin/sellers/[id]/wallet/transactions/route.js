import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const WalletTransaction = (await import('@/server/models/WalletTransaction')).default;
    const transactions = await WalletTransaction.find({ sellerId: params.id }).sort('-createdAt');
    return Response.json({ success: true, transactions });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
