import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  
  try {
    const { id } = await params;
    const Product = (await import('@/server/models/Product')).default;
    
    const product = await Product.findById(id)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name storeName')
      .lean();
    
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Fetch related products in parallel
    let relatedProducts = [];
    if (product.categoryId?._id) {
      relatedProducts = await Product.find({
        categoryId: product.categoryId._id,
        _id: { $ne: id }
      })
      .select('name price images rating reviewCount sold')
      .limit(5)
      .lean();
    }

    return Response.json({ success: true, product, relatedProducts });
  } catch (error) {
    console.error('Product detail error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
