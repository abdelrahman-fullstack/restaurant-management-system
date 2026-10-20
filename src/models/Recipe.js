import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
      unique: true,
    },
    ingredients: [
      {
        inventoryItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InventoryItem',
          required: true,
        },
        quantityRequired: {
          type: Number,
          required: true,
          min: [0.001, 'Quantity required must be positive'],
        },
      },
    ],
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;