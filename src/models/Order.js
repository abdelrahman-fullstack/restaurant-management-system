import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantTable',
    },
    orderType: {
      type: String,
      enum: ['dine_in', 'takeaway'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inventoryDeducted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;