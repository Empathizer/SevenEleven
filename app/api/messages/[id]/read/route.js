import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req);
  if (error) return error;

  try {
    const Message = (await import('@/server/models/Message')).default;
    await Message.findByIdAndUpdate(params.id, { read: true });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
