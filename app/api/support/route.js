import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const SupportMessage = (await import('@/server/models/SupportMessage')).default;
    const messages = await SupportMessage.find({ userId: user.id }).sort({ createdAt: -1 });
    return Response.json({ success: true, messages });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const { subject, message } = body;

  if (!subject || !message) {
    return Response.json({ success: false, message: 'Subject and message required' }, { status: 400 });
  }

  try {
    const SupportMessage = (await import('@/server/models/SupportMessage')).default;
    
    await SupportMessage.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      subject,
      message
    });

    return Response.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
