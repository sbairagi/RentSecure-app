import type { NotificationType, NotificationChannel, NotificationPriority } from '@/features/notifications/types';

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, {
  label: string;
  icon: string;
  color: string;
  defaultPriority: NotificationPriority;
}> = {
  rent_due: { label: 'Rent Due', icon: '💰', color: '#D97706', defaultPriority: 'high' },
  payment_success: { label: 'Payment Success', icon: '✅', color: '#059669', defaultPriority: 'medium' },
  payment_failed: { label: 'Payment Failed', icon: '❌', color: '#DC2626', defaultPriority: 'high' },
  agreement_expiry: { label: 'Agreement Expiry', icon: '📄', color: '#7C3AED', defaultPriority: 'medium' },
  agreement_signed: { label: 'Agreement Signed', icon: '✍️', color: '#2563EB', defaultPriority: 'medium' },
  maintenance_created: { label: 'Maintenance Created', icon: '🔧', color: '#0891B2', defaultPriority: 'low' },
  maintenance_update: { label: 'Maintenance Update', icon: '🔧', color: '#0891B2', defaultPriority: 'low' },
  visitor_request: { label: 'Visitor Request', icon: '👤', color: '#059669', defaultPriority: 'medium' },
  visitor_approved: { label: 'Visitor Approved', icon: '✅', color: '#059669', defaultPriority: 'medium' },
  subscription_expiry: { label: 'Subscription Expiring', icon: '⏰', color: '#DC2626', defaultPriority: 'high' },
  subscription_expired: { label: 'Subscription Expired', icon: '⏰', color: '#DC2626', defaultPriority: 'high' },
  document_shared: { label: 'Document Shared', icon: '📎', color: '#2563EB', defaultPriority: 'medium' },
  system_announcement: { label: 'System Alert', icon: '📢', color: '#6B7280', defaultPriority: 'medium' },
  payout_success: { label: 'Payout Success', icon: '💸', color: '#059669', defaultPriority: 'medium' },
  payout_failed: { label: 'Payout Failed', icon: '⚠️', color: '#DC2626', defaultPriority: 'high' },
  renter_status_change: { label: 'Renter Status Change', icon: '👥', color: '#7C3AED', defaultPriority: 'high' },
  itr_reminder: { label: 'ITR Reminder', icon: '📊', color: '#2563EB', defaultPriority: 'medium' },
  tax_reminder: { label: 'Tax Reminder', icon: '🏛️', color: '#0891B2', defaultPriority: 'medium' },
  extra_charge_reminder: { label: 'Extra Charge Reminder', icon: '💲', color: '#D97706', defaultPriority: 'high' },
};

export const CHANNEL_CONFIG: Record<NotificationChannel, {
  label: string;
  icon: string;
  color: string;
}> = {
  push: { label: 'Push', icon: '🔔', color: '#2563EB' },
  in_app: { label: 'In-App', icon: '📱', color: '#059669' },
  whatsapp: { label: 'WhatsApp', icon: '💬', color: '#25D366' },
  email: { label: 'Email', icon: '📧', color: '#EA4335' },
  sms: { label: 'SMS', icon: '📩', color: '#0891B2' },
};

export const PRIORITY_CONFIG: Record<NotificationPriority, {
  label: string;
  color: string;
  backgroundColor: string;
}> = {
  low: { label: 'Low', color: '#6B7280', backgroundColor: '#F3F4F6' },
  medium: { label: 'Medium', color: '#2563EB', backgroundColor: '#DBEAFE' },
  high: { label: 'High', color: '#D97706', backgroundColor: '#FEF3C7' },
  urgent: { label: 'Urgent', color: '#DC2626', backgroundColor: '#FEE2E2' },
};

export const DELIVERY_STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  backgroundColor: string;
}> = {
  pending: { label: 'Pending', color: '#6B7280', backgroundColor: '#F3F4F6' },
  sent: { label: 'Sent', color: '#2563EB', backgroundColor: '#DBEAFE' },
  delivered: { label: 'Delivered', color: '#059669', backgroundColor: '#D1FAE5' },
  failed: { label: 'Failed', color: '#DC2626', backgroundColor: '#FEE2E2' },
  retrying: { label: 'Retrying', color: '#D97706', backgroundColor: '#FEF3C7' },
  permanent_failed: { label: 'Permanent Failed', color: '#991B1B', backgroundColor: '#FEE2E2' },
};

export const REMINDER_TYPE_CONFIG: Record<string, {
  label: string;
  icon: string;
  color: string;
}> = {
  rent: { label: 'Rent Reminder', icon: '💰', color: '#D97706' },
  tax: { label: 'Tax Reminder', icon: '🏛️', color: '#0891B2' },
  itr: { label: 'ITR Reminder', icon: '📊', color: '#2563EB' },
  extra_charge: { label: 'Extra Charge', icon: '💲', color: '#DC2626' },
};
