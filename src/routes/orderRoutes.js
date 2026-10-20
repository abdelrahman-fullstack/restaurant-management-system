import express from 'express';
import { createOrder, updateOrderStatus, getOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../validators/authValidator.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/orderValidator.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'staff', 'kitchen'), getOrders);
router.post('/', authorize('admin', 'staff'), validate(createOrderSchema), createOrder);
router.patch('/:id/status', authorize('admin', 'staff', 'kitchen'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;