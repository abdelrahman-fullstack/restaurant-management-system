import { z } from 'zod';

export const createReservationSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(5, 'Customer phone is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  table: z.string().min(1, 'Table ID is required'),
  partySize: z.number().int().positive('Party size must be positive'),
  startTime: z.string().datetime('Start time must be ISO standard'),
  endTime: z.string().datetime('End time must be ISO standard').optional(),
  notes: z.string().optional(),
});