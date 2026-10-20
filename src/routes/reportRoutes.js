import express from 'express';
import { getSalesSummary, getTopSellingItems } from '../controllers/reportController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/sales-summary', getSalesSummary);
router.get('/top-selling-items', getTopSellingItems);

export default router;