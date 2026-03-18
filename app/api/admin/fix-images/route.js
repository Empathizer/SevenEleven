import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/api-helper';

const categoryImages = {
  'Jewelry': [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400'
  ],
  "Men's Apparel": [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=400'
  ],
  "Women's Apparel": [
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400',
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400'
  ],
  'Shoes': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
    'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=400',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=400',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
    'https://images.unsplash.com/photo-1583241475880-083f84372725?w=400'
  ]
};

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Product = (await import('@/server/models/Product')).default;
    const Category = (await import('@/server/models/Category')).default;

    const categories = await Category.find().lean();
    const products = await Product.find({ $or: [{ images: [] }, { images: { $size: 0 } }] }).lean();

    let updated = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const cat = categories.find(c => c._id.toString() === p.categoryId?.toString());
      const catName = cat?.name || 'Fashion';
      const imgs = categoryImages[catName] || categoryImages['Fashion'];
      const img = imgs[i % imgs.length];
      await Product.findByIdAndUpdate(p._id, { images: [img] });
      updated++;
    }

    return Response.json({ success: true, message: `${updated} products updated with images` });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
