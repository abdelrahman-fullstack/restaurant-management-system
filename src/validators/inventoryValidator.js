import { z } from 'zod';

export const createInventoryItemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  unit: z.enum(['piece', 'gram', 'kilogram', 'milliliter', 'liter']),
  minimumStockLevel: z.number().min(0, 'Minimum stock level cannot be negative'),
});

export const adjustStockSchema = z.object({
  quantityChange: z.number().refine((val) => val !== 0, 'Quantity change cannot be zero'),
  reason: z.string().min(3, 'Reason for adjustment is required'),
});