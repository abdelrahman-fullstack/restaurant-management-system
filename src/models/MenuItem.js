import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true, // للتحكم في الحذف اللطيف (Soft Delete)
    },
  },
  { timestamps: true }
);

// Indexes للبحث السريع والتصفية
menuItemSchema.index({ name: 'text', category: 1, isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;