import { z } from 'zod';

export const caretakerSchema = z.object({
  unit: z.number().min(1, 'Unit is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\+?1?\d{9,15}$/, 'Phone number must be in format: +999999999'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  alternate_phone: z
    .string()
    .regex(/^\+?1?\d{9,15}$/, 'Phone number must be in format: +999999999')
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  joining_date: z.string().min(1, 'Joining date is required'),
  notes: z.string().optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  leaving_date: z.string().optional().or(z.literal('')),
});

export type CaretakerFormData = z.infer<typeof caretakerSchema>;

export const validateCaretaker = (data: unknown) => {
  return caretakerSchema.safeParse(data);
};
