import mongoose from 'mongoose';

const restaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    section: {
      type: String,
      default: 'Main Hall',
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'unavailable'],
      default: 'available',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const RestaurantTable = mongoose.model('RestaurantTable', restaurantTableSchema);
export default RestaurantTable;