import type { SubscriptionStatus } from '../types';

export function isSubscriptionExpired(endDate: string | null | undefined): boolean {
  if (!endDate) return true;
  return new Date(endDate) < new Date();
}

export function getDaysRemaining(endDate: string | null | undefined): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}

export function getSubscriptionStatus(
  subscription: { is_active: boolean; end_date: string } | null | undefined
): SubscriptionStatus {
  if (!subscription) {
    return {
      isActive: false,
      isExpired: true,
      planName: 'free',
      endDate: null,
      daysRemaining: null,
      isInGracePeriod: false,
    };
  }

  const expired = isSubscriptionExpired(subscription.end_date);
  const daysRemaining = getDaysRemaining(subscription.end_date);
  const isInGracePeriod = expired && daysRemaining !== null && daysRemaining <= 0 && daysRemaining > -7;

  return {
    isActive: subscription.is_active && !expired,
    isExpired: expired,
    planName: 'free',
    endDate: subscription.end_date,
    daysRemaining,
    isInGracePeriod,
  };
}
