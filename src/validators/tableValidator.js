import { z } from 'zod';

export const createTableSchema = z.object({
  tableNumber: z.string().min(1, 'Table number is required'),
  capacity: z.number().int().positive('Capacity must be positive'),
  section: z.string().optional(),
});