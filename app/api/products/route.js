import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  
  try {
    const Product = (await import('@/server/models/Product')).default;
    const Category = (await import('@/server/models/Category')).default;
    const User = (await import('@/server/models/User')).default;
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const adminOnly = searchParams.get('adminOnly');
    
    let query = {};
    
    if (adminOnly === 'true') {
      query.sellerId = null;
    }
    
    if (category) {
      const cat = await Category.findOne({ slug: category }).maxTimeMS(30000);
      if (cat) query.categoryId = cat._id;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort('-createdAt')
      .maxTimeMS(30000)
      .lean();

    const count = await Product.countDocuments(query).maxTimeMS(30000);

    return Response.json({
      success: true,
      data: products,
      products: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Products error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
