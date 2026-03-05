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
    
    const { sendSellerApprovalEmail } = await import('@/lib/email');
    console.log('🔄 Attempting to send approval email to:', seller.userId.email);
    try {
      await sendSellerApprovalEmail({
        email: seller.userId.email,
        name: seller.userId.name,
        storeName: seller.storeName || 'Your Store'
      });
      console.log('📧 Approval email sent successfully');
    } catch (emailError) {
      console.error('❌ Email send failed:', emailError);
    }
    
    return Response.json({ success: true, seller });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
