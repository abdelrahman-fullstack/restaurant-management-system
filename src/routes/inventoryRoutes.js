import express from 'express';
import {
  getInventoryItems,
  getLowStockItems,
  createInventoryItem,
  adjustStock,
  getItemTransactions,
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../validators/authValidator.js';
import { createInventoryItemSchema, adjustStockSchema } from '../validators/inventoryValidator.js';

const router = express.Router();

router.use(protect, authorize('admin', 'staff'));

router.get('/', getInventoryItems);
router.get('/low-stock', getLowStockItems);
router.post('/', validate(createInventoryItemSchema), createInventoryItem);
router.post('/:id/adjust', validate(adjustStockSchema), adjustStock);
router.get('/:id/transactions', getItemTransactions);

export default router;