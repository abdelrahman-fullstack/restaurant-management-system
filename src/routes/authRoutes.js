import express from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authenticate.js';
import { validate, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;