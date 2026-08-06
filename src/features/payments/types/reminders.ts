export interface PaymentReminder {
  id: number;
  payment: number;
  reminder_type: 'whatsapp' | 'email' | 'sms' | 'push';
  sent_at: string;
  sent_by: string;
  status: string;
  whatsapp_status: string;
  email_status: string;
  sms_status: string;
  push_status: string;
  message: string;
  recipient: string;
  created_at: string;
}

export interface ReminderHistory {
  id: number;
  payment: number;
  reminders_sent: number;
  last_reminder_at: string | null;
  reminder_types_sent: string[];
  created_at: string;
  updated_at: string;
}

export interface SendReminderPayload {
  reminder_types: ('whatsapp' | 'email' | 'sms' | 'push')[];
  message?: string;
  notify_renter?: boolean;
}

export interface BulkReminderPayload {
  payment_ids: number[];
  reminder_types: ('whatsapp' | 'email' | 'sms' | 'push')[];
  message?: string;
}

export interface ReminderSettings {
  rent_due_days_before: number;
  rent_overdue_days_after: number;
  reminder_frequency: number;
  enable_whatsapp: boolean;
  enable_email: boolean;
  enable_sms: boolean;
  enable_push: boolean;
}
