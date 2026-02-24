import connectDB from '@/lib/db';

export async function GET() {
  await connectDB();
  
  try {
    const Banner = (await import('@/server/models/Banner')).default;
    console.log('Fetching banners...');
    const banners = await Banner.find({ isActive: true }).maxTimeMS(5000);
    console.log('Banners found:', banners.length);
    return Response.json({ success: true, data: banners });
  } catch (error) {
    console.error('Banner error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
