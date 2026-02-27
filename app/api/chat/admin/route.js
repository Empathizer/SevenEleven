import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Chat = (await import('@/server/models/Chat')).default;
    const chats = await Chat.find().sort({ updatedAt: -1 });
    return Response.json({ success: true, chats });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  const body = await req.json();
  const { chatId, message } = body;

  try {
    const Chat = (await import('@/server/models/Chat')).default;
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return Response.json({ success: false, message: 'Chat not found' }, { status: 404 });
    }

    chat.messages.push({ text: message, sender: 'admin' });
    await chat.save();

    return Response.json({ success: true, messages: chat.messages });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
