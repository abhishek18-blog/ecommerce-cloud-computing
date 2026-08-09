import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.ORDER_SERVICE_PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Order Service connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect Order Service to MongoDB', err);
  });
