import { z } from "zod";

export const visitorStatusValues = [
  "requested",
  "pending_approval",
  "approved",
  "rejected",
  "checked_in",
  "checked_out",
  "expired",
  "cancelled",
  "blocked",
] as const;

export const visitorPurposeValues = [
  "personal_visit",
  "family_visit",
  "business_meeting",
  "service_personnel",
  "maintenance",
  "delivery",
  "emergency",
  "other",
] as const;

export const visitorSchema = z.object({
  visitor_name: z.string().min(1, "Visitor name is required").max(100, "Name must be at most 100 characters"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?1?\d{9,15}$/, "Phone must be in format: +999999999"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  purpose: z.enum(visitorPurposeValues),
  building: z.number().min(1, "Building is required"),
  unit: z.number().min(1, "Unit is required"),
  renter: z.number().min(1, "Renter is required"),
  visit_date: z.string().min(1, "Visit date is required"),
  expected_arrival: z.string().min(1, "Expected arrival is required"),
  expected_departure: z.string().min(1, "Expected departure is required"),
  number_of_visitors: z.number().int().min(1, "At least 1 visitor is required").default(1),
  vehicle_number: z.string().max(20).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type VisitorFormData = z.infer<typeof visitorSchema>;

export const validateVisitor = (data: unknown) => {
  return visitorSchema.safeParse(data);
};

export const visitorApprovalSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type VisitorApprovalFormData = z.infer<typeof visitorApprovalSchema>;

export const validateVisitorApproval = (data: unknown) => {
  return visitorApprovalSchema.safeParse(data);
};

export const visitorCheckInSchema = z.object({
  vehicle_details: z.string().max(100).optional().or(z.literal("")),
  qr_token: z.string().optional().or(z.literal("")),
  otp_code: z.string().max(6).optional().or(z.literal("")),
});

export type VisitorCheckInFormData = z.infer<typeof visitorCheckInSchema>;

export const validateVisitorCheckIn = (data: unknown) => {
  return visitorCheckInSchema.safeParse(data);
};

export const otpVerifySchema = z.object({
  otp_code: z.string().length(6, "OTP must be exactly 6 digits"),
});

export type OTPVerifyFormData = z.infer<typeof otpVerifySchema>;

export const validateOTP = (data: unknown) => {
  return otpVerifySchema.safeParse(data);
};

export const visitorFilterSchema = z.object({
  search: z.string().optional().or(z.literal("")),
  status: z.enum(visitorStatusValues).optional().or(z.literal("")),
  building: z.number().optional(),
  unit: z.number().optional(),
  renter: z.number().optional(),
  visit_date: z.string().optional().or(z.literal("")),
  ordering: z.string().optional().or(z.literal("")),
  page: z.number().int().positive().optional(),
});

export const validateVisitorFilters = (data: unknown) => {
  return visitorFilterSchema.safeParse(data);
};
