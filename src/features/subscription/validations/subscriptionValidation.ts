import { z } from 'zod';

export const planNameSchema = z.enum(['free', 'pro', 'elite']);

export const billingCycleSchema = z.enum(['monthly', 'yearly']);

export const addOnPurchaseSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  is_recurring: z.boolean().default(false),
});

export type AddOnPurchaseInput = z.infer<typeof addOnPurchaseSchema>;

export function validatePlanTransition(currentPlan: string, newPlan: string): { valid: boolean; error?: string } {
  const order = ['free', 'pro', 'elite'];
  const currentIdx = order.indexOf(currentPlan);
  const newIdx = order.indexOf(newPlan);

  if (newIdx === -1) {
    return { valid: false, error: 'Invalid plan selected' };
  }
  if (newIdx === currentIdx) {
    return { valid: false, error: 'You are already on this plan' };
  }
  return { valid: true };
}

export function validateSubscriptionDates(startDate: string, endDate: string): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }
  if (end <= start) {
    return { valid: false, error: 'End date must be after start date' };
  }
  return { valid: true };
}
