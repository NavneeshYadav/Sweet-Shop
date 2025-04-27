// /models/Order.ts
import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  customerAddress: String,
  cartItems: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  totalPrice: Number,
  shippingCost: Number,
  grandTotal: Number,
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
