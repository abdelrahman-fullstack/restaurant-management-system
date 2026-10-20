import { z } from 'zod';

export const saveRecipeSchema = z.object({
  ingredients: z.array(
    z.object({
      inventoryItem: z.string().min(1, 'Inventory item ID is required'),
      quantityRequired: z.number().min(0.001, 'Quantity must be positive'),
    })
  ).min(1, 'At least one ingredient is required'),
});