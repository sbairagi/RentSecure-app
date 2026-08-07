import { z } from 'zod';

export const maintenanceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['plumbing', 'electrical', 'ac', 'appliance', 'carpentry', 'cleaning', 'security', 'water', 'internet', 'other'], {
    required_error: 'Category is required',
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Priority is required',
  }),
  building: z.number().min(1, 'Building is required'),
  unit: z.number().min(1, 'Unit is required'),
  renter: z.number().nullable().optional(),
  preferred_date: z.string().nullable().optional(),
  notes: z.string().optional().or(z.literal('')),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

export const validateMaintenance = (data: unknown) => {
  return maintenanceSchema.safeParse(data);
};

export const maintenanceStatusSchema = z.object({
  status: z.enum(['created', 'submitted', 'acknowledged', 'assigned', 'in_progress', 'waiting_for_parts', 'waiting_for_approval', 'resolved', 'closed', 'rejected', 'cancelled'], {
    required_error: 'Status is required',
  }),
  resolution_notes: z.string().optional().or(z.literal('')),
});

export type MaintenanceStatusFormData = z.infer<typeof maintenanceStatusSchema>;

export const validateMaintenanceStatus = (data: unknown) => {
  return maintenanceStatusSchema.safeParse(data);
};

export const maintenanceCommentSchema = z.object({
  text: z.string().min(1, 'Comment is required'),
  mentions: z.array(z.number()).optional(),
});

export type MaintenanceCommentFormData = z.infer<typeof maintenanceCommentSchema>;

export const validateMaintenanceComment = (data: unknown) => {
  return maintenanceCommentSchema.safeParse(data);
};

export const maintenanceExpenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  estimated_cost: z.string().optional().or(z.literal('')),
  actual_cost: z.string().optional().or(z.literal('')),
  vendor_cost: z.string().optional().or(z.literal('')),
  material_cost: z.string().optional().or(z.literal('')),
  labour_cost: z.string().optional().or(z.literal('')),
  additional_charges: z.string().optional().or(z.literal('')),
  payment_status: z.enum(['pending', 'paid', 'partially_paid', 'refunded']).optional(),
});

export type MaintenanceExpenseFormData = z.infer<typeof maintenanceExpenseSchema>;

export const validateMaintenanceExpense = (data: unknown) => {
  return maintenanceExpenseSchema.safeParse(data);
};
