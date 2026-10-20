import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running successfully' });
});

// All Application Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/menu', recipeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;