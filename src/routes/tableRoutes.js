import express from 'express';
import { getTables, createTable, checkAvailability } from '../controllers/tableController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../validators/authValidator.js';
import { createTableSchema } from '../validators/tableValidator.js';

const router = express.Router();

router.get('/availability', checkAvailability);
router.get('/', protect, getTables);
router.post('/', protect, authorize('admin', 'staff'), validate(createTableSchema), createTable);

export default router;