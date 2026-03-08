import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const { id } = await params;
    const Message = (await import('@/server/models/Message')).default;
    
    // Get all messages between current user and the other user
    const messages = await Message.find({
      $or: [
        { senderId: user._id, receiverId: id },
        { senderId: id, receiverId: user._id }
      ]
    }).sort('createdAt').lean();

    // Mark messages as read where current user is receiver
    await Message.updateMany(
      { senderId: id, receiverId: user._id, read: false },
      { read: true }
    );

    console.log(`Loaded ${messages.length} messages between ${user._id} and ${id}`);
    return Response.json({ success: true, messages });
  } catch (error) {
    console.error('Messages [id] GET error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
