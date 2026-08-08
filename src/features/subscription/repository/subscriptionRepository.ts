import { apiService } from '@/services/api/apiClient';
import type {
  AddOnPurchase,
  PlanFeatureLimit,
  SubscriptionPlan,
  UserSubscription,
  UsageLimit,
  SubscriptionPayment,
  PaymentOrderResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from '../types';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

export const subscriptionRepository = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiService.get<SubscriptionPlan[] | { results: SubscriptionPlan[] }>(
      SUBSCRIPTION_CONSTANTS.API.PLANS
    );
    if (Array.isArray(response)) {
      return response.filter(p => p.is_active);
    }
    return (response as { results: SubscriptionPlan[] }).results?.filter(p => p.is_active) ?? [];
  },

  async getPlanDetail(id: number | string): Promise<SubscriptionPlan> {
    return apiService.get<SubscriptionPlan>(SUBSCRIPTION_CONSTANTS.API.PLAN_DETAIL(id));
  },

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    try {
      const response = await apiService.get<UserSubscription | { results: UserSubscription[] }>(
        SUBSCRIPTION_CONSTANTS.API.CURRENT
      );
      if (Array.isArray(response)) {
        return response[0] || null;
      }
      return response as UserSubscription;
    } catch {
      return null;
    }
  },

  async createOrUpdateSubscription(data: Partial<UserSubscription>): Promise<UserSubscription> {
    return apiService.post<UserSubscription>(SUBSCRIPTION_CONSTANTS.API.CURRENT, data);
  },

  async deleteSubscription(id: number | string): Promise<void> {
    return apiService.delete<void>(SUBSCRIPTION_CONSTANTS.API.CURRENT_DETAIL(id));
  },

  async getAddOns(): Promise<AddOnPurchase[]> {
    const response = await apiService.get<AddOnPurchase[] | { results: AddOnPurchase[] }>(
      SUBSCRIPTION_CONSTANTS.API.ADD_ONS
    );
    if (Array.isArray(response)) {
      return response;
    }
    return (response as { results: AddOnPurchase[] }).results ?? [];
  },

  async purchaseAddOn(data: { name: string; amount: string; is_recurring?: boolean }): Promise<AddOnPurchase> {
    return apiService.post<AddOnPurchase>(SUBSCRIPTION_CONSTANTS.API.ADD_ONS, data);
  },

  async deleteAddOn(id: number | string): Promise<void> {
    return apiService.delete<void>(SUBSCRIPTION_CONSTANTS.API.ADD_ON_DETAIL(id));
  },

  async getUsageLimits(): Promise<UsageLimit[]> {
    const response = await apiService.get<UsageLimit[] | { results: UsageLimit[] }>(
      SUBSCRIPTION_CONSTANTS.API.USAGE_LIMITS
    );
    if (Array.isArray(response)) {
      return response;
    }
    return (response as { results: UsageLimit[] }).results ?? [];
  },

  async getBootstrapData(): Promise<{
    maintenance: { isMaintenance: boolean; message?: string };
    appVersion: { isUpdateRequired: boolean; latestVersion: string };
    user?: { id: number; phone: string; email: string; fullName: string; role: string; permissions: string[] };
    subscription?: UserSubscription | null;
    addOns?: AddOnPurchase[];
    featureLimits?: UsageLimit[];
  }> {
    return apiService.get(SUBSCRIPTION_CONSTANTS.API.BOOTSTRAP);
  },

  // Payment APIs - these do NOT exist on backend yet
  async createSubscriptionOrder(_data: {
    planId?: number;
    addOnData?: { name: string; amount: string };
    billingCycle: 'monthly' | 'yearly';
  }): Promise<PaymentOrderResponse> {
    throw new Error('Subscription payment API not yet implemented on backend');
  },

  async verifySubscriptionPayment(_data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    throw new Error('Subscription payment verification API not yet implemented on backend');
  },

  async getPaymentHistory(): Promise<SubscriptionPayment[]> {
    throw new Error('Subscription payment history API not yet implemented on backend');
  },
};
