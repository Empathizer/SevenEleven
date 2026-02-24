import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const Message = (await import('@/server/models/Message')).default;
    const messages = await Message.find({ receiverId: user.id })
      .populate('senderId', 'name email')
      .sort('-createdAt');
    return Response.json({ success: true, messages });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
