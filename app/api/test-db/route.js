import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    const Category = (await import('@/server/models/Category')).default;
    console.log('Category model:', Category);
    
    const categories = await Category.find().limit(1);
    
    return Response.json({ 
      success: true, 
      count: categories.length,
      categories 
    });
  } catch (error) {
    console.error('Test error:', error);
    return Response.json({ 
      success: false, 
      message: error.message,
      name: error.name
    }, { status: 500 });
  }
}
