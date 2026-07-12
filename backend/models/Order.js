import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Paid, Shipped
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    zipCode: String
  },
  paymentId: { type: String } // Mock payment ID
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
