import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from './db';

export async function getUser(req) {
  await connectDB();
  
  const cookieStore = cookies();
  let token = cookieStore.get('token')?.value;
  
  if (!token && req.headers.get('authorization')?.startsWith('Bearer')) {
    token = req.headers.get('authorization').split(' ')[1];
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { default: User } = await import('@/server/models/User');
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}

export function unauthorized() {
  return Response.json({ success: false, message: 'Not authorized' }, { status: 401 });
}

export function forbidden(role) {
  return Response.json({ 
    success: false, 
    message: `Role ${role} is not authorized` 
  }, { status: 403 });
}

export async function requireAuth(req, ...roles) {
  const user = await getUser(req);
  
  if (!user) {
    return { error: unauthorized(), user: null };
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { error: forbidden(user.role), user: null };
  }
  
  return { error: null, user };
}
