import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    stock: 50
  },
  {
    name: 'Minimalist Smartwatch',
    description: 'Sleek design, fitness tracking, and heart rate monitor.',
    price: 199.50,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    stock: 30
  },
  {
    name: 'Ergonomic Desk Chair',
    description: 'Adjustable lumbar support and breathable mesh back.',
    price: 149.99,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600',
    stock: 20
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches.',
    price: 120.00,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600',
    stock: 45
  },
  {
    name: 'Ceramic Coffee Mug',
    description: 'Handcrafted ceramic mug, perfect for your morning brew.',
    price: 24.99,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600',
    stock: 100
  },
  {
    name: 'Yoga Mat',
    description: 'Eco-friendly, non-slip yoga mat with alignment lines.',
    price: 45.00,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600',
    stock: 60
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set with ergonomic grip for home workouts.',
    price: 89.99,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1586401700818-28564a2da557?auto=format&fit=crop&q=80&w=600',
    stock: 25
  },
  {
    name: 'Modern Sofa',
    description: 'Comfortable 3-seater modern sofa with premium fabric.',
    price: 899.00,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    stock: 5
  },
  {
    name: '4K Ultra HD Monitor',
    description: '27-inch 4K monitor for gaming and professional design.',
    price: 349.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
    stock: 15
  },
  {
    name: 'Aesthetic Table Lamp',
    description: 'Warm LED table lamp for reading and ambient lighting.',
    price: 39.99,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    stock: 80
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    await Product.deleteMany({});
    console.log('Cleared existing products');
    await Product.insertMany(sampleProducts);
    console.log('Inserted sample products');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Failed to seed database', err);
    process.exit(1);
  });
