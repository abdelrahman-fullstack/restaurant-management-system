import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  isAvailable: z.boolean().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();