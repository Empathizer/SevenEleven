import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    const seller = await Seller.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).populate('userId');
    await User.findByIdAndUpdate(seller.userId._id, { status: 'active' });
    
    const { sendEmail } = require('@/server/utils/email');
    await sendEmail({
      to: seller.userId.email,
      subject: 'Seller Account Approved!',
      html: `<h2>Congratulations ${seller.userId.name}!</h2><p>Your seller account has been approved.</p><p>Store: ${seller.storeName}</p><p>You can now login and start selling on SevenEleven.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">Login Now</a></p>`
    });
    
    return Response.json({ success: true, seller });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
