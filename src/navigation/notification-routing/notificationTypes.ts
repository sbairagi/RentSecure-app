export type NotificationCategory =
  | 'rent_due'
  | 'rent_paid'
  | 'rent_overdue'
  | 'maintenance_assigned'
  | 'maintenance_updated'
  | 'maintenance_completed'
  | 'visitor_request'
  | 'visitor_approved'
  | 'visitor_checked_in'
  | 'visitor_checked_out'
  | 'agreement_expiring'
  | 'agreement_signed'
  | 'agreement_created'
  | 'subscription_expiring'
  | 'subscription_renewed'
  | 'subscription_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'payout_success'
  | 'payout_failed'
  | 'document_uploaded'
  | 'kyc_completed'
  | 'onboarding_invite'
  | 'system'
  | 'general';

export interface NotificationRoutingConfig {
  category: NotificationCategory;
  titlePatterns: RegExp[];
  messagePatterns: RegExp[];
  targetRoute: string;
  resourceType?: 'rent_record' | 'maintenance' | 'visitor' | 'agreement' | 'subscription' | 'document' | 'renter' | 'unit' | 'building' | 'caretaker';
  requiresAuth?: boolean;
  requiresRole?: string[];
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  resourceId?: string;
  resourceType?: string;
  data?: Record<string, any>;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationRouterState {
  pendingNotification: NotificationPayload | null;
  isRouting: boolean;
  lastRoutedAt: number | null;
  error: string | null;
}
