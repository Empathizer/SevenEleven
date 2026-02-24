import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  
  try {
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    if (body.action === 'register') {
      const { name, email, password, role, storeName, storeDescription, idType, idNumber, idImage, address, invitationCode } = body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Response.json({ success: false, message: 'Email already exists' }, { status: 400 });
      }

      if (role === 'seller' && !invitationCode) {
        return Response.json({ success: false, message: 'Invitation code required' }, { status: 400 });
      }

      const user = await User.create({
        name, email, password,
        role: role || 'customer',
        status: role === 'seller' ? 'pending' : 'active'
      });

      if (role === 'seller') {
        await Seller.create({
          userId: user._id, storeName, storeDescription,
          idType, idNumber, idImage, address, invitationCode,
          status: 'pending'
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      (await cookies()).set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 });

      return Response.json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
        token
      }, { status: 201 });
    }
    
    const { email, password } = body;
    if (!email || !password) {
      return Response.json({ success: false, message: 'Provide email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user._id });
      if (seller && seller.status !== 'approved') {
        return Response.json({ success: false, message: 'Seller account pending approval' }, { status: 403 });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    (await cookies()).set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 });

    return Response.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
      token
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
