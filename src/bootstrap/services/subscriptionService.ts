import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { SubscriptionInfo } from '../types/bootstrap';

class SubscriptionService {
  async loadSubscription(): Promise<SubscriptionInfo | null> {
    try {
      const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.SUBSCRIPTIONS);
      const subscriptions = response?.results || response || [];
      const activeSubscription = Array.isArray(subscriptions)
        ? subscriptions.find((s: any) => s.is_active)
        : null;

      const subscription: SubscriptionInfo | null = activeSubscription
        ? {
            id: activeSubscription.id,
            user: activeSubscription.user,
            plan: {
              id: activeSubscription.plan?.id || 0,
              name: activeSubscription.plan?.name || 'free',
              monthly_price: String(activeSubscription.plan?.monthly_price || '0'),
              yearly_price: String(activeSubscription.plan?.yearly_price || '0'),
              features: activeSubscription.plan?.features || '',
              is_active: activeSubscription.plan?.is_active ?? true,
            },
            start_date: String(activeSubscription.start_date),
            end_date: String(activeSubscription.end_date),
            is_active: activeSubscription.is_active,
            is_yearly: activeSubscription.is_yearly,
            tax_reminder_days_before: activeSubscription.tax_reminder_days_before || 7,
            rent_reminder_days_before: activeSubscription.rent_reminder_days_before || 7,
            created_at: String(activeSubscription.created_at),
            updated_at: String(activeSubscription.updated_at),
          }
        : null;

      useSubscriptionStore.getState().setSubscription(subscription as any);
      logger.info('Subscription loaded', { hasSubscription: !!subscription });
      return subscription;
    } catch (error) {
      logger.error('Failed to load subscription', error as Error);
      useSubscriptionStore.getState().setError('Failed to load subscription');
      return null;
    }
  }

  isExpired(subscription: SubscriptionInfo | null): boolean {
    if (!subscription) return true;
    return new Date(subscription.end_date) < new Date();
  }

  isActive(subscription: SubscriptionInfo | null): boolean {
    if (!subscription) return false;
    return subscription.is_active && !this.isExpired(subscription);
  }

  getDaysRemaining(subscription: SubscriptionInfo | null): number | null {
    if (!subscription) return null;
    const diff = new Date(subscription.end_date).getTime() - Date.now();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  clear(): void {
    useSubscriptionStore.getState().clearSubscription();
  }
}

export const subscriptionService = new SubscriptionService();
