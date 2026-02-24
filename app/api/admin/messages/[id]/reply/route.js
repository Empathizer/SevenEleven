import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { reply } = body;

  if (!reply) {
    return Response.json({ success: false, message: 'Reply required' }, { status: 400 });
  }

  try {
    const SupportMessage = (await import('@/server/models/SupportMessage')).default;
    
    const message = await SupportMessage.findById(id);
    if (!message) {
      return Response.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    await SupportMessage.create({
      userId: message.userId,
      userName: 'Admin',
      userEmail: user.email,
      userRole: 'admin',
      subject: `Re: ${message.subject}`,
      message: reply,
      status: 'replied'
    });

    message.status = 'replied';
    message.adminReply = reply;
    await message.save();

    return Response.json({ success: true, message: 'Reply sent' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
