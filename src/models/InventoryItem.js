import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['piece', 'gram', 'kilogram', 'milliliter', 'liter'],
    },
    minimumStockLevel: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export default InventoryItem;
