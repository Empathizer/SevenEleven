import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const Seller = (await import('@/server/models/Seller')).default;
    const seller = await Seller.findOne({ userId: user.id }).populate('userId');
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    return Response.json({ success: true, seller });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;

  try {
    const body = await req.json();
    const Seller = (await import('@/server/models/Seller')).default;
    const seller = await Seller.findOneAndUpdate(
      { userId: user.id },
      { storeName: body.storeName, storeDescription: body.storeDescription },
      { new: true }
    );
    return Response.json({ success: true, seller });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
