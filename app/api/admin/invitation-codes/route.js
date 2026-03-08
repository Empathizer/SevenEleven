import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const InvitationCode = (await import('@/server/models/InvitationCode')).default;
    
    const code = 'INV' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    await InvitationCode.create({
      code,
      createdBy: user._id
    });

    return Response.json({ success: true, code });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const InvitationCode = (await import('@/server/models/InvitationCode')).default;
    const codes = await InvitationCode.find().sort({ createdAt: -1 });
    return Response.json({ success: true, codes });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
