import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req, { params }) {
  await connectDB();
  const { error, user: adminUser } = await requireAuth(req, 'admin');
  if (error) {
    console.error('Login-as auth failed:', error);
    return error;
  }

  try {
    const { id } = await params;
    const User = (await import('@/server/models/User')).default;
    const jwt = require('jsonwebtoken');

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    console.log('Admin logging in as:', user.email, 'Role:', user.role);
    
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
    
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax'
    });
    
    return Response.json({ success: true, user, token });
  } catch (error) {
    console.error('Login-as error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
