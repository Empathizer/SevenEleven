import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { name, email, message, chatId } = body;

  try {
    const Chat = (await import('@/server/models/Chat')).default;

    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (chat) {
        chat.messages.push({ text: message, sender: 'guest' });
        await chat.save();
        return Response.json({ success: true, chatId: chat._id, messages: chat.messages });
      }
    }

    const newChat = await Chat.create({
      guestName: name,
      guestEmail: email,
      messages: [{ text: message, sender: 'guest' }]
    });

    return Response.json({ success: true, chatId: newChat._id, messages: newChat.messages });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return Response.json({ success: false, message: 'Chat ID required' }, { status: 400 });
  }

  try {
    const Chat = (await import('@/server/models/Chat')).default;
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return Response.json({ success: false, message: 'Chat not found' }, { status: 404 });
    }

    return Response.json({ success: true, messages: chat.messages });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
