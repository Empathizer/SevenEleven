import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error, user } = await requireAuth(req, 'customer');
  if (error) return error;

  try {
    const body = await req.json();
    const { items, shippingAddress, paymentMethod } = body;
    
    const Product = (await import('@/server/models/Product')).default;
    const Order = (await import('@/server/models/Order')).default;
    const User = (await import('@/server/models/User')).default;

    if (!items || items.length === 0) {
      return Response.json({ success: false, message: 'No items' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return Response.json({ success: false, message: `Product not found` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return Response.json({ success: false, message: `Insufficient stock` }, { status: 400 });
      }

      const profit = (product.price - (product.buyingPrice || 0)) * item.quantity;
      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images[0] || '',
        quantity: item.quantity,
        price: product.price,
        buyingPrice: product.buyingPrice || 0,
        profit,
        sellerId: product.sellerId
      });

      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: user.id,
      items: orderItems,
      totalAmount,
      profit: orderItems.reduce((sum, item) => sum + item.profit, 0),
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid'
    });

    const sellerTotals = {};
    const sellerBuyingCosts = {};
    for (const item of orderItems) {
      if (!sellerTotals[item.sellerId]) {
        sellerTotals[item.sellerId] = 0;
        sellerBuyingCosts[item.sellerId] = 0;
      }
      sellerTotals[item.sellerId] += item.price * item.quantity;
      sellerBuyingCosts[item.sellerId] += (item.buyingPrice || 0) * item.quantity;
    }
    
    for (const [sellerId, amount] of Object.entries(sellerTotals)) {
      await User.findByIdAndUpdate(sellerId, {
        $inc: { pendingBalance: amount, walletBalance: -sellerBuyingCosts[sellerId] }
      });
    }

    return Response.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const Order = (await import('@/server/models/Order')).default;
    let query = {};
    if (user.role === 'customer') query.userId = user.id;
    else if (user.role === 'seller') query['items.sellerId'] = user.id;
    
    const orders = await Order.find(query).populate('userId', 'name email').sort('-createdAt');
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
