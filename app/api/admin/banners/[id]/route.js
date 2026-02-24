import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const Banner = (await import('@/server/models/Banner')).default;
    const banner = await Banner.findByIdAndUpdate(params.id, body, { new: true });
    return Response.json({ success: true, banner });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Banner = (await import('@/server/models/Banner')).default;
    await Banner.findByIdAndDelete(params.id);
    return Response.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
