import connectDB from '@/lib/db';

export async function GET() {
  await connectDB();
  
  try {
    const Category = (await import('@/server/models/Category')).default;
    const Product = (await import('@/server/models/Product')).default;
    console.log('Fetching categories...');
    const categories = await Category.find().maxTimeMS(5000);
    console.log('Categories found:', categories.length);
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ categoryId: cat._id }).maxTimeMS(5000);
        return { ...cat.toObject(), productCount };
      })
    );

    return Response.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    console.error('Categories error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
