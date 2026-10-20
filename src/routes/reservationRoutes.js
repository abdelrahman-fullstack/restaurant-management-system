import express from 'express';
import { createReservation, getReservations } from '../controllers/reservationController.js';
import { protect } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../validators/authValidator.js';
import { createReservationSchema } from '../validators/reservationValidator.js';

const router = express.Router();

router.post('/', protect, validate(createReservationSchema), createReservation);
router.get('/', protect, authorize('admin', 'staff'), getReservations);

export default router;