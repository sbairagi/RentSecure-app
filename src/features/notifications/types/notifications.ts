export type NotificationChannel = 'push' | 'in_app' | 'whatsapp' | 'email' | 'sms';

export type NotificationType =
  | 'rent_due'
  | 'payment_success'
  | 'payment_failed'
  | 'agreement_expiry'
  | 'agreement_signed'
  | 'maintenance_created'
  | 'maintenance_update'
  | 'visitor_request'
  | 'visitor_approved'
  | 'subscription_expiry'
  | 'subscription_expired'
  | 'document_shared'
  | 'system_announcement'
  | 'payout_success'
  | 'payout_failed'
  | 'renter_status_change'
  | 'itr_reminder'
  | 'tax_reminder'
  | 'extra_charge_reminder';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  data?: Record<string, any>;
  action_url?: string;
  action_label?: string;
  image_url?: string;
  archived?: boolean;
  resource_type?: string;
  resource_id?: string;
}

export interface NotificationFilters {
  search?: string;
  type?: NotificationType | 'all';
  read_status?: 'all' | 'read' | 'unread';
  date_from?: string;
  date_to?: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type NotificationErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'MAINTENANCE'
  | 'SUBSCRIPTION_EXPIRED'
  | 'OFFLINE'
  | 'API_FAILURE'
  | 'UNKNOWN';
