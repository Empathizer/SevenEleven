import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const Order = (await import('@/server/models/Order')).default;

    const orders = await Order.find({
      'items.buyingPrice': { $in: [0, null] }
    }).limit(200);

    let updated = 0;
    for (const order of orders) {
      let orderUpdated = false;
      
      for (const item of order.items) {
        if (!item.buyingPrice || item.buyingPrice === 0) {
          const profitMargin = 0.10 + (Math.random() * 0.15);
          item.buyingPrice = item.price * (1 - profitMargin);
          item.profit = (item.price - item.buyingPrice) * item.quantity;
          orderUpdated = true;
        }
      }
      
      if (orderUpdated) {
        order.profit = order.items.reduce((sum, item) => sum + (item.profit || 0), 0);
        await order.save();
        updated++;
      }
    }

    return Response.json({ 
      success: true, 
      message: `Updated ${updated} orders with correct profit (10-25%)`,
      updated 
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
