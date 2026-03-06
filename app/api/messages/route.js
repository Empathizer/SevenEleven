import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const Message = (await import('@/server/models/Message')).default;
    const User = (await import('@/server/models/User')).default;
    
    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: user.id }, { receiverId: user.id }]
    }).sort('-createdAt').lean();

    // Group by conversation partner
    const conversationMap = new Map();
    
    for (const msg of messages) {
      const otherIdStr = msg.senderId.toString() === user.id ? msg.receiverId.toString() : msg.senderId.toString();
      
      if (!conversationMap.has(otherIdStr)) {
        const otherUser = await User.findById(otherIdStr).select('name email storeName role').lean();
        if (otherUser) {
          conversationMap.set(otherIdStr, {
            _id: otherIdStr,
            otherUser: { 
              _id: otherIdStr, 
              name: otherUser.storeName || otherUser.name, 
              email: otherUser.email,
              role: otherUser.role
            },
            lastMessage: msg.message,
            lastMessageTime: msg.createdAt
          });
        }
      }
    }

    const conversations = Array.from(conversationMap.values()).sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
    
    return Response.json({ success: true, conversations });
  } catch (error) {
    console.error('Messages GET error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const body = await req.json();
    const Message = (await import('@/server/models/Message')).default;
    
    if (!body.receiverId || !body.message) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    
    const message = await Message.create({
      senderId: user.id,
      receiverId: body.receiverId,
      message: body.message.trim(),
      read: false
    });

    console.log('Message created:', { from: user.id, to: body.receiverId, msg: body.message });
    return Response.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error('Message POST error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
