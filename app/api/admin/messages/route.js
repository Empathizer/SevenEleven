import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const SupportMessage = (await import('@/server/models/SupportMessage')).default;
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    return Response.json({ success: true, messages });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;

  const body = await req.json();
  const { sellerId, subject, message } = body;

  if (!sellerId || !subject || !message) {
    return Response.json({ success: false, message: 'All fields required' }, { status: 400 });
  }

  try {
    const SupportMessage = (await import('@/server/models/SupportMessage')).default;
    
    await SupportMessage.create({
      userId: sellerId,
      userName: 'Admin',
      userEmail: user.email,
      userRole: 'admin',
      subject,
      message,
      status: 'replied'
    });

    return Response.json({ success: true, message: 'Message sent to seller' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
