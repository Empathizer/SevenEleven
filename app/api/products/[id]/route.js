import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  await connectDB();
  
  try {
    const { id } = await params;
    const Product = (await import('@/server/models/Product')).default;
    const product = await Product.findById(id)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name storeName');
    
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, product });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
