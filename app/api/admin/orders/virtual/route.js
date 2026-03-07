import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const body = await req.json();
    const Order = (await import('@/server/models/Order')).default;
    const Product = (await import('@/server/models/Product')).default;

    const { customerId, sellerId, items, totalAmount, shippingAddress } = body;

    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const buyingPrice = product?.buyingPrice || item.buyingPrice || 0;
      const buyingCost = buyingPrice * item.quantity;
      const sellingAmount = item.price * item.quantity;
      const profit = sellingAmount - buyingCost;
      
      orderItems.push({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        buyingPrice,
        profit,
        sellerId
      });
      
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    const order = await Order.create({
      userId: customerId,
      items: orderItems,
      totalAmount,
      profit: orderItems.reduce((sum, item) => sum + item.profit, 0),
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'COD',
      isVirtual: true
    });

    return Response.json({ success: true, order, message: 'Virtual order created' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
