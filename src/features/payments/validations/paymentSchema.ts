import { z } from 'zod';
import type { PaymentMethod, PaymentStatus } from '../types/payments';
import type { InvoiceStatus } from '../types/invoices';

export const paymentMethodSchema = z.enum([
  'cash',
  'bank_transfer',
  'upi',
  'cheque',
  'credit_card',
  'debit_card',
  'wallet',
  'net_banking',
  'other',
]);

export const paymentStatusSchema = z.enum([
  'pending',
  'paid',
  'partially_paid',
  'failed',
  'cancelled',
  'refunded',
  'processing',
  'overdue',
]);

export const invoiceStatusSchema = z.enum([
  'draft',
  'sent',
  'viewed',
  'paid',
  'overdue',
  'cancelled',
]);

export const collectRentSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  payment_method: paymentMethodSchema,
  late_fee: z.string().optional().default('0'),
  discount: z.string().optional().default('0'),
  tax: z.string().optional().default('0'),
  transaction_id: z.string().optional(),
  remarks: z.string().optional(),
  payment_date: z.string().optional(),
});

export const retryPaymentSchema = z.object({
  reason: z.string().optional(),
  notify_renter: z.boolean().optional().default(true),
});

export const refundSchema = z.object({
  amount: z.string().min(1, 'Refund amount is required').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Refund amount must be a positive number',
  }),
  reason: z.string().min(1, 'Refund reason is required'),
  notify_renter: z.boolean().optional().default(true),
});

export const paymentFiltersSchema = z.object({
  search: z.string().optional(),
  status: paymentStatusSchema.optional(),
  payment_method: paymentMethodSchema.optional(),
  renter: z.number().optional(),
  unit: z.number().optional(),
  building: z.number().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  ordering: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export const sendReminderSchema = z.object({
  reminder_types: z.array(z.enum(['whatsapp', 'email', 'sms', 'push'])).min(1, 'Select at least one reminder type'),
  message: z.string().optional(),
  notify_renter: z.boolean().optional().default(true),
});

export const bulkReminderSchema = z.object({
  payment_ids: z.array(z.number()).min(1, 'Select at least one payment'),
  reminder_types: z.array(z.enum(['whatsapp', 'email', 'sms', 'push'])).min(1, 'Select at least one reminder type'),
  message: z.string().optional(),
});

export const generateInvoiceSchema = z.object({
  rent_record_ids: z.array(z.number()).min(1, 'Select at least one rent record'),
  invoice_date: z.string().optional(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
});

export const exportPaymentsSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'pdf']),
  payment_ids: z.array(z.number()).optional(),
  filters: paymentFiltersSchema.optional(),
});

export type CollectRentForm = z.infer<typeof collectRentSchema>;
export type RetryPaymentForm = z.infer<typeof retryPaymentSchema>;
export type RefundForm = z.infer<typeof refundSchema>;
export type PaymentFiltersForm = z.infer<typeof paymentFiltersSchema>;
export type SendReminderForm = z.infer<typeof sendReminderSchema>;
export type BulkReminderForm = z.infer<typeof bulkReminderSchema>;
export type GenerateInvoiceForm = z.infer<typeof generateInvoiceSchema>;
export type ExportPaymentsForm = z.infer<typeof exportPaymentsSchema>;
