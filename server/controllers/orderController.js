const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.productId} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
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
        profit: profit,
        sellerId: product.sellerId
      });

      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const totalProfit = orderItems.reduce((sum, item) => sum + item.profit, 0);

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      profit: totalProfit,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid'
    });

    // Add to seller pending balance and deduct buying price from wallet
    const User = require('../models/User');
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
      const buyingCost = sellerBuyingCosts[sellerId];
      console.log(`Seller ${sellerId}: Adding ${amount} to pending, deducting ${buyingCost} from wallet`);
      await User.findByIdAndUpdate(sellerId, {
        $inc: { 
          pendingBalance: amount,
          walletBalance: -buyingCost
        }
      });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let query = {};
    
    // If user is customer, show only their orders
    if (req.user.role === 'customer') {
      query.userId = req.user.id;
    }
    // If user is seller, show orders with their products
    else if (req.user.role === 'seller') {
      query['items.sellerId'] = req.user.id;
    }
    // Admin sees all orders
    
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    }).populate('items.productId', 'name images');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
