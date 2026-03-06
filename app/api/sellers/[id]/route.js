import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  
  try {
    const { id } = await params;
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    const user = await User.findById(id).select('name email storeName storeDescription address rating role').lean();
    
    if (!user || user.role !== 'seller') {
      return Response.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }

    const seller = await Seller.findOne({ userId: id }).lean();
    
    console.log('Seller API - User:', user.name, 'ID:', id);
    console.log('Seller API - Seller doc:', seller ? 'Found' : 'Not found');
    
    return Response.json({ 
      success: true, 
      seller: {
        ...user,
        ...seller,
        _id: id
      }
    });
  } catch (error) {
    console.error('Seller API error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
