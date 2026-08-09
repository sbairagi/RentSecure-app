import { NOTIFICATION_TITLE_PATTERNS } from '@/navigation/constants';
import type { NotificationCategory, NotificationPayload } from '@/navigation/types';

export function categorizeNotification(title: string, message: string): NotificationCategory {
  const combined = `${title} ${message}`.toLowerCase();

  for (const [category, patterns] of Object.entries(NOTIFICATION_TITLE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(combined)) {
        return category as NotificationCategory;
      }
    }
  }

  if (combined.includes('rent')) return 'rent_due';
  if (combined.includes('payment')) return 'payment_success';
  if (combined.includes('visitor')) return 'visitor_request';
  if (combined.includes('maintenance')) return 'maintenance_assigned';
  if (combined.includes('agreement')) return 'agreement_expiring';
  if (combined.includes('subscription')) return 'subscription_expiring';
  if (combined.includes('document')) return 'document_uploaded';
  if (combined.includes('kyc') || combined.includes('verification')) return 'kyc_completed';

  return 'general';
}

export function extractResourceId(message: string): string | undefined {
  const idPatterns = [
    /#(\d+)/,
    /ID[:\s]+(\d+)/,
    /id[:\s]+(\d+)/,
    /record[:\s]+(\d+)/,
    /ticket[:\s]+(\d+)/,
    /request[:\s]+(\d+)/,
    /(\d{5,})/,
  ];

  for (const pattern of idPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return undefined;
}

export function parseNotificationPayload(
  notification: { id: string; title: string; message: string; data?: Record<string, any> }
): NotificationPayload {
  const category = categorizeNotification(notification.title, notification.message);
  const resourceId = notification.data?.resource_id || notification.data?.id ||
                     extractResourceId(notification.message);

  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    category,
    resourceId,
    resourceType: notification.data?.resource_type,
    data: notification.data,
    createdAt: notification.data?.created_at || new Date().toISOString(),
    isRead: false,
  };
}
