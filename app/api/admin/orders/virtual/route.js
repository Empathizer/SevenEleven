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

    const order = await Order.create({
      userId: customerId,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        sellerId
      })),
      totalAmount,
      shippingAddress,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'virtual',
      isVirtual: true
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    return Response.json({ success: true, order, message: 'Virtual order created' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
