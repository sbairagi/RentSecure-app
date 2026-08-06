import { z } from 'zod';

export const renterCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?1?\d{9,15}$/, 'Please enter a valid phone number')
    .min(1, 'Phone number is required'),
  emergency_contact_name: z
    .string()
    .max(100, 'Emergency contact name must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  emergency_contact_number: z
    .string()
    .regex(/^\+?1?\d{9,15}$/, 'Please enter a valid emergency contact number')
    .optional()
    .or(z.literal('')),
  rent_amount: z
    .string()
    .min(1, 'Rent amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'Rent amount must be a positive number' }
    ),
  start_date: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Please enter a valid start date'),
  end_date: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        return !isNaN(Date.parse(val));
      },
      { message: 'Please enter a valid end date' }
    ),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional().or(z.literal('')),
});

export const renterUpdateSchema = renterCreateSchema.partial();

export type RenterCreateFormData = z.infer<typeof renterCreateSchema>;
export type RenterUpdateFormData = z.infer<typeof renterUpdateSchema>;
