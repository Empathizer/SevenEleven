const Order = require('../models/Order');
const Seller = require('../models/Seller');
const PDFDocument = require('pdfkit');
const { logAdminAction } = require('../utils/auditLog');

exports.getOrders = async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus, isVirtual, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (isVirtual !== undefined) filter.isVirtualOrder = isVirtual === 'true';

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone isVirtual')
      .populate('items.productId', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone isVirtual')
      .populate('items.productId', 'name images')
      .populate('items.sellerId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus, pickupStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id).populate('items.sellerId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.deliveryStatus;

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (pickupStatus) order.pickupStatus = pickupStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Move pending balance to wallet when delivered
    if (deliveryStatus === 'Delivered' && oldStatus !== 'Delivered') {
      for (const item of order.items) {
        const seller = await Seller.findOne({ userId: item.sellerId });
        if (seller && order.profit) {
          const itemProfit = (order.profit / order.items.length);
          seller.walletBalance += itemProfit;
          seller.pendingBalance -= itemProfit;
          await seller.save();
        }
      }
    }

    await order.save();

    await logAdminAction(
      req.user._id,
      'UPDATE_ORDER_STATUS',
      order._id,
      'Order',
      { deliveryStatus, pickupStatus, paymentStatus },
      req.ip
    );

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await logAdminAction(
      req.user._id,
      'DELETE_ORDER',
      order._id,
      'Order',
      { orderId: order._id },
      req.ip
    );

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateReceipt = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${order._id}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('EsellerStore', { align: 'center' });
    doc.fontSize(10).text('Order Receipt', { align: 'center' });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
    doc.text(`Status: ${order.deliveryStatus}`);
    doc.moveDown();

    // Customer Info
    doc.text(`Customer: ${order.userId.name}`);
    doc.text(`Email: ${order.userId.email}`);
    doc.text(`Phone: ${order.userId.phone || 'N/A'}`);
    doc.text(`Address: ${order.shippingAddress}`);
    doc.moveDown();

    // Items
    doc.fontSize(14).text('Items:', { underline: true });
    doc.fontSize(10);
    order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.productName || item.productId?.name || 'Product'}`);
      doc.text(`   Qty: ${item.quantity} x $${item.price} = $${item.quantity * item.price}`);
    });
    doc.moveDown();

    // Total
    doc.fontSize(12).text(`Total Amount: $${order.totalAmount}`, { bold: true });
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);

    doc.end();

    await logAdminAction(
      req.user._id,
      'GENERATE_ORDER_RECEIPT',
      order._id,
      'Order',
      {},
      req.ip
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
