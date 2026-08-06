import { z } from 'zod';

export const unitCreateSchema = z.object({
  unit: z
    .string()
    .min(1, 'Unit number is required')
    .max(100, 'Unit number must be at most 100 characters'),
  unit_type: z.enum(
    ['land', 'flat', 'commercial_shop', 'house', 'villa', 'office', 'paying_guest'],
    { required_error: 'Unit type is required' }
  ),
  address_line: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be at most 255 characters'),
  landmark: z
    .string()
    .max(255, 'Landmark must be at most 255 characters')
    .optional()
    .or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100, 'City must be at most 100 characters'),
  state: z.string().max(100, 'State must be at most 100 characters').optional().or(z.literal('')),
  country: z
    .string()
    .max(100, 'Country must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  postal_code: z
    .string()
    .max(20, 'Postal code must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  latitude: z.string().optional().or(z.literal('')).nullable(),
  longitude: z.string().optional().or(z.literal('')).nullable(),
  maintenance_notes: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  rent_due_reminder: z.boolean().optional(),
  agreement_expiry_reminder: z.boolean().optional(),
});

export const unitUpdateSchema = unitCreateSchema.partial();

export const bulkOperationSchema = z.object({
  unit_ids: z.array(z.number().positive()).min(1, 'Select at least one unit'),
  action: z.enum(['archive', 'unarchive', 'delete', 'update_status', 'update_building']),
  data: z.record(z.string(), z.any()).optional(),
});

export type UnitCreateFormData = z.infer<typeof unitCreateSchema>;
export type UnitUpdateFormData = z.infer<typeof unitUpdateSchema>;
export type BulkOperationFormData = z.infer<typeof bulkOperationSchema>;
