import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;
    const Seller = (await import('@/server/models/Seller')).default;
    const User = (await import('@/server/models/User')).default;
    
    const seller = await Seller.findOne({ userId: id }).populate('userId').lean();
    
    if (!seller) {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }
    
    // Check if seller is approved
    if (seller.status !== 'approved') {
      return Response.json({ success: false, message: 'Seller not verified' }, { status: 403 });
    }
    
    const user = seller.userId;
    
    return Response.json({ 
      success: true, 
      seller: {
        ...seller,
        name: user?.name,
        email: user?.email,
        storeName: seller.storeName,
        storeDescription: seller.storeDescription,
        address: seller.address,
        rating: 5.0
      }
    });
  } catch (error) {
    console.error('Seller detail error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
