import { z } from 'zod';

export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');
export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number');
export const requiredString = (fieldName: string) => z.string().min(1, `${fieldName} is required`);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    firstName: requiredString('First name'),
    lastName: requiredString('Last name'),
    email: emailSchema,
    phone: phoneSchema.optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const propertySchema = z.object({
  name: requiredString('Property name'),
  address: requiredString('Address'),
  city: requiredString('City'),
  state: requiredString('State'),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
});

export const buildingSchema = z.object({
  name: requiredString('Building name'),
  propertyId: requiredString('Property'),
  floors: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
});

export const unitSchema = z.object({
  unitNumber: requiredString('Unit number'),
  buildingId: requiredString('Building'),
  type: z.enum(['1bhk', '2bhk', '3bhk', 'studio', 'office', 'commercial']),
  rent: z.coerce.number().positive('Rent must be positive'),
  deposit: z.coerce.number().nonnegative().optional(),
  status: z.enum(['available', 'occupied', 'maintenance']),
  description: z.string().optional(),
});

export const renterSchema = z.object({
  firstName: requiredString('First name'),
  lastName: requiredString('Last name'),
  email: emailSchema.optional(),
  phone: requiredString('Phone number'),
  moveInDate: z.string().optional(),
  moveOutDate: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  paymentDate: z.string(),
  paymentMethod: z.enum(['cash', 'upi', 'bank_transfer', 'cheque', 'card']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type PropertyForm = z.infer<typeof propertySchema>;
export type BuildingForm = z.infer<typeof buildingSchema>;
export type UnitForm = z.infer<typeof unitSchema>;
export type RenterForm = z.infer<typeof renterSchema>;
export type PaymentForm = z.infer<typeof paymentSchema>;
