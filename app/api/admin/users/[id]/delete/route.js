import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    const Product = (await import('@/server/models/Product')).default;
    const Order = (await import('@/server/models/Order')).default;
    
    await Seller.deleteMany({ userId: id });
    await Product.deleteMany({ sellerId: id });
    await Order.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    
    return Response.json({ success: true, message: 'User deleted permanently' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
