import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/api-helper';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req, { params }) {
  await connectDB();
  
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { id } = await params;
  
  try {
    const User = (await import('@/server/models/User')).default;
    const user = await User.findById(id);
    
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });
    
    return Response.json({ success: true, message: `Logged in as ${user.name}` });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
