import { z } from 'zod';

export const createOrderSchema = z.object({
  orderType: z.enum(['dine_in', 'takeaway']),
  table: z.string().optional(),
  items: z.array(
    z.object({
      menuItem: z.string().min(1, 'Menu item ID is required'),
      quantity: z.number().int().positive('Quantity must be a positive integer'),
    })
  ).min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
});