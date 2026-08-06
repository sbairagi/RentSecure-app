import type {
  CollectRentPayload,
  ExportPaymentsPayload,
  GenerateInvoicePayload,
  Payment,
  PaymentAnalytics,
  PaymentFilters,
  PaymentListResponse,
  PaymentLink,
  PaymentSummary,
  PaymentTimelineEntry,
  RefundPayload,
  RetryPaymentPayload,
} from '../types/payments';
import type { BulkReminderPayload, PaymentReminder } from '../types/reminders';
import type { Payout } from '../types/payouts';
import { paymentsApi } from '../services/paymentsApi';
import { invoicesApi } from '../services/invoicesApi';
import { payoutsApi } from '../services/payoutsApi';
import { refundsApi } from '../services/refundsApi';
import { remindersApi } from '../services/remindersApi';

export const paymentsRepository = {
  fetchPayments: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    return paymentsApi.list(params);
  },

  fetchPayment: async (id: number | string): Promise<Payment> => {
    return paymentsApi.retrieve(id);
  },

  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    return paymentsApi.create(data);
  },

  updatePayment: async (id: number | string, data: Partial<Payment>): Promise<Payment> => {
    return paymentsApi.update(id, data);
  },

  deletePayment: async (id: number | string): Promise<void> => {
    return paymentsApi.remove(id);
  },

  initiatePayment: async (data: { rent_record_id: number; payment_method: string; amount: string }): Promise<{ order_id: string; payment_link: string; amount: string }> => {
    return paymentsApi.initiate(data);
  },

  verifyPayment: async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<{ status: string; payment: Payment }> => {
    return paymentsApi.verify(data);
  },

  refundPayment: async (id: number | string, data: RefundPayload): Promise<Payment> => {
    return paymentsApi.refund(id, data);
  },

  fetchPaymentHistory: async (params?: { renter?: number; page?: number }): Promise<PaymentListResponse> => {
    return paymentsApi.getHistory(params);
  },

  fetchOverduePayments: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    return paymentsApi.getOverdue(params);
  },

  fetchPendingPayments: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    return paymentsApi.getPending(params);
  },

  fetchFailedPayments: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    return paymentsApi.getFailed(params);
  },

  fetchPaymentAnalytics: async (params?: { period?: string; building?: number }): Promise<PaymentAnalytics> => {
    return paymentsApi.getAnalytics(params);
  },

  fetchPaymentSummary: async (params?: { period?: string; building?: number }): Promise<PaymentSummary> => {
    return paymentsApi.getSummary(params);
  },

  fetchPaymentTimeline: async (id: number | string): Promise<PaymentTimelineEntry[]> => {
    return paymentsApi.getTimeline(id);
  },

  retryPayment: async (id: number | string, data?: RetryPaymentPayload): Promise<Payment> => {
    return paymentsApi.retry(id, data);
  },

  cancelPayment: async (id: number | string, reason?: string): Promise<Payment> => {
    return paymentsApi.cancel(id, reason);
  },

  bulkRetryPayments: async (data: { payment_ids: number[]; reason?: string }): Promise<{ retried: number; failed: number }> => {
    return paymentsApi.bulkRetry(data);
  },

  bulkCancelPayments: async (data: { payment_ids: number[]; reason: string }): Promise<{ cancelled: number; failed: number }> => {
    return paymentsApi.bulkCancel(data);
  },

  fetchPaymentLink: async (id: number | string): Promise<PaymentLink> => {
    return paymentsApi.getPaymentLink(id);
  },

  regeneratePaymentLink: async (id: number | string): Promise<PaymentLink> => {
    return paymentsApi.regenerateLink(id);
  },

  fetchQrCode: async (id: number | string): Promise<{ qr_code: string }> => {
    return paymentsApi.getQrCode(id);
  },

  sendReminder: async (paymentId: number | string, data: { reminder_types: string[]; message?: string }): Promise<PaymentReminder> => {
    return paymentsApi.sendReminder(paymentId, data);
  },

  bulkSendReminder: async (data: BulkReminderPayload): Promise<{ sent: number; failed: number }> => {
    return paymentsApi.bulkReminder(data);
  },

  fetchReminderHistory: async (paymentId: number | string): Promise<PaymentReminder[]> => {
    return paymentsApi.getReminderHistory(paymentId);
  },

  collectRent: async (data: CollectRentPayload): Promise<Payment> => {
    return paymentsApi.collectRent(data);
  },

  fetchReceipts: async (params?: { renter?: number; page?: number }): Promise<PaymentListResponse> => {
    return paymentsApi.getReceipts(params);
  },

  fetchReceipt: async (id: number | string): Promise<{ receipt_url: string }> => {
    return paymentsApi.getReceipt(id);
  },

  exportPayments: async (data: ExportPaymentsPayload): Promise<Blob> => {
    return paymentsApi.exportPayments(data);
  },

  fetchInvoices: async (params?: { status?: string; search?: string; page?: number; page_size?: number }): Promise<any> => {
    return invoicesApi.list(params);
  },

  fetchInvoice: async (id: number | string): Promise<any> => {
    return invoicesApi.retrieve(id);
  },

  createInvoice: async (data: GenerateInvoicePayload): Promise<any> => {
    return invoicesApi.create(data);
  },

  deleteInvoice: async (id: number | string): Promise<void> => {
    return invoicesApi.delete(id);
  },

  downloadInvoice: async (id: number | string): Promise<Blob> => {
    return invoicesApi.download(id);
  },

  sendInvoice: async (id: number | string, data?: { send_via?: string[] }): Promise<{ status: string }> => {
    return invoicesApi.send(id, data);
  },

  markInvoicePaid: async (id: number | string, data?: { payment_id?: number }): Promise<any> => {
    return invoicesApi.markPaid(id, data);
  },

  previewInvoice: async (id: number | string): Promise<{ pdf_url: string }> => {
    return invoicesApi.preview(id);
  },

  shareInvoice: async (id: number | string, data: { send_via: string[] }): Promise<{ status: string }> => {
    return invoicesApi.share(id, data);
  },

  searchInvoices: async (query: string): Promise<any> => {
    return invoicesApi.search(query);
  },

  getInvoiceStats: async (): Promise<any> => {
    return invoicesApi.getStats();
  },

  bulkGenerateInvoices: async (data: GenerateInvoicePayload): Promise<{ generated: number; failed: number }> => {
    return invoicesApi.bulkGenerate(data);
  },

  fetchPayouts: async (params?: { status?: string; payment?: number; page?: number; page_size?: number }): Promise<any> => {
    return payoutsApi.list(params);
  },

  fetchPayout: async (id: number | string): Promise<Payout> => {
    return payoutsApi.retrieve(id);
  },

  fetchPayoutSummary: async (params?: { period?: string; building?: number }): Promise<any> => {
    return payoutsApi.getSummary(params);
  },

  retryPayout: async (id: number | string, data?: { reason?: string }): Promise<Payout> => {
    return payoutsApi.retry(id, data);
  },

  bulkRetryPayouts: async (data: { payout_ids: number[]; reason?: string }): Promise<{ retried: number; failed: number }> => {
    return payoutsApi.bulkRetry(data);
  },

  fetchRefunds: async (params?: { payment?: number; status?: string; page?: number }): Promise<any> => {
    return refundsApi.list(params);
  },

  fetchRefund: async (id: number | string): Promise<any> => {
    return refundsApi.retrieve(id);
  },

  approveRefund: async (id: number | string): Promise<any> => {
    return refundsApi.approve(id);
  },

  rejectRefund: async (id: number | string, reason: string): Promise<any> => {
    return refundsApi.reject(id, reason);
  },

  getReminderSettings: async (): Promise<any> => {
    return remindersApi.getSettings();
  },

  updateReminderSettings: async (data: any): Promise<any> => {
    return remindersApi.updateSettings(data);
  },
};
