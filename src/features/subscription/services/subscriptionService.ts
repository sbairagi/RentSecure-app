import { apiService } from '@/services/api/apiClient';
import { subscriptionRepository } from '../repository';
import type { AddOnPurchase, SubscriptionPlan, UserSubscription, UsageLimit } from '../types';
import { SUBSCRIPTION_CONSTANTS } from '../constants';
import { isSubscriptionExpired, getDaysRemaining, getSubscriptionStatus } from '../utils/subscriptionHelpers';

export class SubscriptionService {
  async loadAllData(): Promise<{
    subscription: UserSubscription | null;
    plans: SubscriptionPlan[];
    addOns: AddOnPurchase[];
    usageLimits: UsageLimit[];
  }> {
    const [subscription, plans, addOns, usageLimits] = await Promise.all([
      subscriptionRepository.getCurrentSubscription(),
      subscriptionRepository.getPlans(),
      subscriptionRepository.getAddOns(),
      subscriptionRepository.getUsageLimits(),
    ]);

    return { subscription, plans, addOns, usageLimits };
  }

  async loadFromBootstrap(): Promise<{
    subscription: UserSubscription | null;
    addOns: AddOnPurchase[];
    usageLimits: UsageLimit[];
  }> {
    const data = await subscriptionRepository.getBootstrapData();
    return {
      subscription: data.subscription ?? null,
      addOns: data.addOns ?? [],
      usageLimits: data.featureLimits ?? [],
    };
  }

  isExpired(subscription: UserSubscription | null): boolean {
    return isSubscriptionExpired(subscription?.end_date);
  }

  getDaysRemaining(subscription: UserSubscription | null): number | null {
    return getDaysRemaining(subscription?.end_date);
  }

  getStatus(subscription: UserSubscription | null) {
    return getSubscriptionStatus(subscription as any);
  }

  isInGracePeriod(subscription: UserSubscription | null): boolean {
    if (!subscription?.end_date) return false;
    const daysRemaining = this.getDaysRemaining(subscription);
    return daysRemaining !== null && daysRemaining <= 0 && daysRemaining > -SUBSCRIPTION_CONSTANTS.GRACE_PERIOD_DAYS;
  }

  getPlanOrder(planName: string): number {
    const order = SUBSCRIPTION_CONSTANTS.PLAN_ORDER as readonly string[];
    return order.indexOf(planName);
  }

  canUpgrade(currentPlan: string, targetPlan: string): boolean {
    return this.getPlanOrder(targetPlan) > this.getPlanOrder(currentPlan);
  }

  canDowngrade(currentPlan: string, targetPlan: string): boolean {
    return this.getPlanOrder(targetPlan) < this.getPlanOrder(currentPlan);
  }

  getPlanById(plans: SubscriptionPlan[], id: number): SubscriptionPlan | undefined {
    return plans.find(p => p.id === id);
  }

  getPlanByName(plans: SubscriptionPlan[], name: string): SubscriptionPlan | undefined {
    return plans.find(p => p.name === name);
  }
}

export const subscriptionService = new SubscriptionService();
