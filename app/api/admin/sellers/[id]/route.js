import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const Seller = (await import('@/server/models/Seller')).default;
    
    await Seller.findByIdAndUpdate(id, body);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
