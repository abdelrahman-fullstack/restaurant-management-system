import express from 'express';
import { saveRecipe, getRecipeByMenuId } from '../controllers/recipeController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../validators/authValidator.js';
import { saveRecipeSchema } from '../validators/recipeValidator.js';

const router = express.Router();

router.use(protect, authorize('admin', 'staff'));

router.post('/:menuId/recipe', validate(saveRecipeSchema), saveRecipe);
router.get('/:menuId/recipe', getRecipeByMenuId);

export default router;