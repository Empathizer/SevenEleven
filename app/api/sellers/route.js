import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    
    const Seller = (await import('@/server/models/Seller')).default;
    const Product = (await import('@/server/models/Product')).default;
    
    let query = { status: 'approved' };
    
    if (search) {
      query.storeName = { $regex: search, $options: 'i' };
    }
    
    const sellers = await Seller.find(query).populate('userId', 'name email').lean().limit(20);
    
    // Get product count for each seller
    const sellersWithCount = await Promise.all(
      sellers.map(async (seller) => {
        const productCount = await Product.countDocuments({ sellerId: seller.userId?._id });
        return {
          ...seller,
          productCount
        };
      })
    );
    
    return Response.json({ success: true, data: sellersWithCount });
  } catch (error) {
    console.error('Sellers search error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
