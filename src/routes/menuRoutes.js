import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../validators/authValidator.js';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menuValidator.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

router.post('/', protect, authorize('admin', 'staff'), validate(createMenuItemSchema), createMenuItem);
router.patch('/:id', protect, authorize('admin', 'staff'), validate(updateMenuItemSchema), updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

export default router;