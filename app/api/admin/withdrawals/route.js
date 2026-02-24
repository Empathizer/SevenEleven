import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Withdrawal = (await import('@/server/models/Withdrawal')).default;
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    return Response.json({ success: true, withdrawals });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
