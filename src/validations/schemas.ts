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
  .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits');
export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must be numeric');
export const requiredString = (fieldName: string) => z.string().min(1, `${fieldName} is required`);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const phoneLoginSchema = z.object({
  phone: phoneSchema,
});

export const signupSchema = z
  .object({
    firstName: requiredString('First name'),
    lastName: requiredString('Last name'),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(['property_owner', 'renter', 'caretaker']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const verifyOtpSchema = z.object({
  otp: otpSchema,
});

export type LoginForm = z.infer<typeof loginSchema>;
export type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type CreatePasswordForm = z.infer<typeof createPasswordSchema>;
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;
