import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Mock Payment Gateway Checkout
router.post('/checkout', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      totalAmount += product.price * item.quantity;
      
      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Process Mock Payment
    const paymentId = 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create Order
    const orderItems = items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    const order = new Order({
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentId,
      status: 'Paid'
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully!', orderId: order._id, paymentId });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update order status (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create order (POST) - equivalent to checkout but standard REST
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      totalAmount += product.price * item.quantity;
      
      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Process Mock Payment
    const paymentId = 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create Order
    const orderItems = items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    const order = new Order({
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentId,
      status: 'Paid'
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully!', orderId: order._id, paymentId, order });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
