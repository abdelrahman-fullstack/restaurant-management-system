import Recipe from '../models/Recipe.js';
import MenuItem from '../models/MenuItem.js';
import InventoryItem from '../models/InventoryItem.js';

// @desc    Create or update recipe for a menu item
// @route   POST /api/menu/:menuId/recipe
// @access  Private (Admin / Staff)
export const saveRecipe = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const { ingredients } = req.body;

    const menuItem = await MenuItem.findById(menuId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // التحقق من وجود جميع أصناف المخزون
    for (const ing of ingredients) {
      const invItem = await InventoryItem.findById(ing.inventoryItem);
      if (!invItem) {
        return res.status(404).json({ success: false, message: `Inventory item ${ing.inventoryItem} not found` });
      }
    }

    let recipe = await Recipe.findOne({ menuItem: menuId });
    if (recipe) {
      recipe.ingredients = ingredients;
      await recipe.save();
    } else {
      recipe = await Recipe.create({ menuItem: menuId, ingredients });
    }

    res.status(200).json({ success: true, message: 'Recipe saved successfully', data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recipe by menu item ID
// @route   GET /api/menu/:menuId/recipe
// @access  Private (Admin / Staff)
export const getRecipeByMenuId = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ menuItem: req.params.menuId }).populate('ingredients.inventoryItem');
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found for this menu item' });
    }
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};