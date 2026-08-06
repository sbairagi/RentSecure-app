import { z } from 'zod';

export const agreementCreateSchema = z.object({
  renter: z.number().positive('Renter is required'),
  unit: z.number().positive('Unit is required'),
  agreement_start_date: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Please enter a valid start date'),
  agreement_end_date: z
    .string()
    .min(1, 'End date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Please enter a valid end date'),
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
  security_deposit: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: 'Security deposit must be a non-negative number' }
    ),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional().or(z.literal('')),
  witness_name: z.string().max(100, 'Witness name must be at most 100 characters').optional().or(z.literal('')),
  witness_phone: z
    .string()
    .regex(/^\+?1?\d{9,15}$/, 'Please enter a valid witness phone number')
    .optional()
    .or(z.literal('')),
  witness_address: z.string().max(500, 'Witness address must be at most 500 characters').optional().or(z.literal('')),
});

export const agreementUpdateSchema = agreementCreateSchema.partial().extend({
  owner_signed: z.boolean().optional(),
  renter_signed: z.boolean().optional(),
  leegality_document_id: z.string().optional().or(z.literal('')),
  is_agreement_revoked: z.boolean().optional(),
  revocation_reason: z.string().max(1000).optional().or(z.literal('')),
  revoked_by_owner: z.boolean().optional(),
});

export const agreementFilterSchema = z.object({
  search: z.string().optional().or(z.literal('')),
  status: z.string().optional().or(z.literal('')),
  building: z.number().positive().optional().or(z.literal('')),
  unit: z.number().positive().optional().or(z.literal('')),
  renter: z.number().positive().optional().or(z.literal('')),
  date_from: z.string().optional().or(z.literal('')),
  date_to: z.string().optional().or(z.literal('')),
  is_signed: z.boolean().optional(),
  ordering: z.string().optional().or(z.literal('')),
  page: z.number().positive().optional(),
});

export type AgreementCreateFormData = z.infer<typeof agreementCreateSchema>;
export type AgreementUpdateFormData = z.infer<typeof agreementUpdateSchema>;
export type AgreementFilterFormData = z.infer<typeof agreementFilterSchema>;
