import connectDB from '@/lib/db';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  
  try {
    const Product = (await import('@/server/models/Product')).default;
    const Category = (await import('@/server/models/Category')).default;
    // Ensure User model is registered so populate('sellerId') works
    const User = (await import('@/server/models/User')).default;
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = {};
    
    if (category) {
      const cat = await Category.findOne({ slug: category }).maxTimeMS(5000);
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

    console.log('Fetching products with query:', query);
    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort('-createdAt')
      .maxTimeMS(5000);

    console.log('Products found:', products.length);
    const count = await Product.countDocuments(query).maxTimeMS(5000);

    return Response.json({
      success: true,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Products error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
