import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from './db';

export async function getUser(req) {
  await connectDB();
  const cookieStore = await cookies();
  let token = cookieStore.get('token')?.value;
  
  if (!token && req.headers.get('authorization')?.startsWith('Bearer')) {
    token = req.headers.get('authorization').split(' ')[1];
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { default: User } = await import('@/server/models/User');
    const user = await User.findById(decoded.id).lean();
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(req, ...roles) {
  const user = await getUser(req);
  
  if (!user) {
    return { 
      error: Response.json({ success: false, message: 'Not authorized' }, { status: 401 }), 
      user: null 
    };
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { 
      error: Response.json({ success: false, message: `Role ${user.role} is not authorized` }, { status: 403 }), 
      user: null 
    };
  }
  
  return { error: null, user };
}
