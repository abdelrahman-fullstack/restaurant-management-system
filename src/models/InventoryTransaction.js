import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema(
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ['purchase', 'adjustment', 'order_consumption', 'reversal'],
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    resultingQuantity: {
      type: Number,
      required: true,
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
export default InventoryTransaction;