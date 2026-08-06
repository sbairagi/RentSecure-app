import { apiService } from '@/services/api/apiClient';
import type {
  BulkReminderPayload,
  PaymentReminder,
  ReminderSettings,
  SendReminderPayload,
} from '../types/reminders';
import { PAYMENT_CONSTANTS } from '../constants/payments';

export const remindersApi = {
  sendReminder: async (paymentId: number | string, data: SendReminderPayload): Promise<PaymentReminder> => {
    return apiService.post<PaymentReminder>(PAYMENT_CONSTANTS.API.SEND_REMINDER(paymentId), data);
  },

  bulkReminder: async (data: BulkReminderPayload): Promise<{ sent: number; failed: number }> => {
    return apiService.post(PAYMENT_CONSTANTS.API.BULK_REMINDER, data);
  },

  getReminderHistory: async (paymentId: number | string): Promise<PaymentReminder[]> => {
    return apiService.get<PaymentReminder[]>(PAYMENT_CONSTANTS.API.REMINDER_HISTORY(paymentId));
  },

  getSettings: async (): Promise<ReminderSettings> => {
    return apiService.get<ReminderSettings>('/notifications/settings/');
  },

  updateSettings: async (data: Partial<ReminderSettings>): Promise<ReminderSettings> => {
    return apiService.patch<ReminderSettings>('/notifications/settings/', data);
  },
};
