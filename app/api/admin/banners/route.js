import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Banner = (await import('@/server/models/Banner')).default;
    const banners = await Banner.find();
    return Response.json({ success: true, banners });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const Banner = (await import('@/server/models/Banner')).default;
    const banner = await Banner.create(body);
    return Response.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
