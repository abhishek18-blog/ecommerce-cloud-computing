import express from 'express';
import { Order, OrderItem, Product } from '../models/index.js';

const router = express.Router();

// Helper checkout processor
const processCheckout = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items required' });
    }

    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      const price = item.price || product.price;
      totalAmount += price * item.quantity;
      verifiedItems.push({ product, quantity: item.quantity, price });
    }

    // Deduct stock
    for (const item of verifiedItems) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    const paymentId = 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const order = await Order.create({
      totalAmount,
      status: 'Paid',
      fullName: shippingAddress?.fullName || '',
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      zipCode: shippingAddress?.zipCode || '',
      paymentId
    });

    for (const item of verifiedItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price
      });
    }

    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });

    res.status(201).json({ message: 'Order placed successfully!', orderId: order.id, paymentId, order: createdOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Mock Payment Gateway Checkout
router.post('/checkout', processCheckout);

// Standard POST / api/orders
router.post('/', processCheckout);

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });
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
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
