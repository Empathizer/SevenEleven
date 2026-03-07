import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function PUT(req, { params }) {
  await connectDB();
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  try {
    const Order = (await import('@/server/models/Order')).default;
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    
    const order = await Order.findById(id);
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // When seller picks order, deduct buying cost from wallet and add selling amount to pending
    if ((status === 'processing' || status === 'shipped' || status === 'delivered') && user.role === 'seller' && order.status === 'pending') {
      const seller = await User.findById(user.id);
      
      const sellerItems = order.items.filter(item => item.sellerId?.toString() === user.id);
      const totalBuyingCost = sellerItems.reduce((sum, item) => sum + (item.buyingPrice * item.quantity), 0);
      const totalSellingAmount = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if ((seller.walletBalance || 0) < totalBuyingCost) {
        return Response.json({ 
          success: false, 
          message: `Insufficient balance. Required: $${totalBuyingCost.toFixed(2)}, Available: $${(seller.walletBalance || 0).toFixed(2)}` 
        }, { status: 400 });
      }
      
      seller.walletBalance = (seller.walletBalance || 0) - totalBuyingCost;
      seller.pendingBalance = (seller.pendingBalance || 0) + totalSellingAmount;
      await seller.save();
      
      await Seller.findOneAndUpdate(
        { userId: user.id },
        { 
          walletBalance: seller.walletBalance,
          pendingBalance: seller.pendingBalance
        },
        { upsert: true }
      );
    }

    // When order delivered, move selling amount from pending to wallet
    if (status === 'delivered' || status === 'completed') {
      for (const item of order.items) {
        if (item.sellerId) {
          const sellingAmount = item.price * item.quantity;
          
          const seller = await User.findByIdAndUpdate(
            item.sellerId,
            {
              $inc: {
                pendingBalance: -sellingAmount,
                walletBalance: sellingAmount
              }
            },
            { new: true }
          );
          
          if (seller) {
            await Seller.findOneAndUpdate(
              { userId: item.sellerId },
              { 
                walletBalance: seller.walletBalance,
                pendingBalance: seller.pendingBalance 
              },
              { upsert: true }
            );
          }
        }
      }
    }

    order.status = status;
    await order.save();

    return Response.json({ success: true, order });
  } catch (error) {
    console.error('Order status update error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
