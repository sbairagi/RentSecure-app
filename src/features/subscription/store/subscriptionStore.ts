import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';

export type PlanName = 'free' | 'pro' | 'elite';
export type BillingCycle = 'monthly' | 'yearly';
export type PaymentStatus = 'idle' | 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

const PENDING_PAYMENT_KEY = 'subscription_pending_payment';

export interface Subscription {
  subscription: import('../types').UserSubscription | null;
  plans: import('../types').SubscriptionPlan[];
  addOns: import('../types').AddOnPurchase[];
  usageLimits: import('../types').UsageLimit[];
  featureLimits: import('../types').PlanFeatureLimit[];
  effectiveLimits: import('../types').EffectiveLimit[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  pendingPayment: {
    orderId: string | null;
    planId: number | null;
    billingCycle: BillingCycle | null;
    status: PaymentStatus;
    createdAt: number;
  } | null;
}

export interface SubscriptionActions {
  setSubscription: (subscription: import('../types').UserSubscription | null) => void;
  setPlans: (plans: import('../types').SubscriptionPlan[]) => void;
  setAddOns: (addOns: import('../types').AddOnPurchase[]) => void;
  setUsageLimits: (limits: import('../types').UsageLimit[]) => void;
  setFeatureLimits: (limits: import('../types').PlanFeatureLimit[]) => void;
  setEffectiveLimits: (limits: import('../types').EffectiveLimit[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSubscription: () => void;
  setPendingPayment: (payment: Subscription['pendingPayment']) => void;
  clearPendingPayment: () => void;
  refresh: () => Promise<void>;
  recoverPendingPayment: () => Promise<void>;
}

type SubscriptionStore = Subscription & SubscriptionActions;

const initialState: Subscription = {
  subscription: null,
  plans: [],
  addOns: [],
  usageLimits: [],
  featureLimits: [],
  effectiveLimits: [],
  isLoading: true,
  error: null,
  lastUpdated: 0,
  pendingPayment: null,
};

export const useSubscriptionFeatureStore = create<SubscriptionStore>((set, get) => ({
  ...initialState,

  setSubscription: (subscription) =>
    set({
      subscription,
      isLoading: false,
      error: null,
      lastUpdated: Date.now(),
    }),

  setPlans: (plans) =>
    set((state) => ({
      plans,
      isLoading: false,
      lastUpdated: Date.now(),
    })),

  setAddOns: (addOns) =>
    set({
      addOns,
      lastUpdated: Date.now(),
    }),

  setUsageLimits: (usageLimits) =>
    set({
      usageLimits,
      lastUpdated: Date.now(),
    }),

  setFeatureLimits: (featureLimits) =>
    set({
      featureLimits,
      lastUpdated: Date.now(),
    }),

  setEffectiveLimits: (effectiveLimits) =>
    set({
      effectiveLimits,
      lastUpdated: Date.now(),
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearSubscription: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  setPendingPayment: (pendingPayment) => {
    try {
      if (pendingPayment) {
        mmkvStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pendingPayment));
      } else {
        mmkvStorage.removeItem(PENDING_PAYMENT_KEY);
      }
    } catch {
      // storage error - non-critical
    }
    set({
      pendingPayment,
      lastUpdated: Date.now(),
    });
  },

  clearPendingPayment: () => {
    try {
      mmkvStorage.removeItem(PENDING_PAYMENT_KEY);
    } catch {
      // storage error - non-critical
    }
    set({
      pendingPayment: null,
    });
  },

  refresh: async () => {
    set({ isLoading: true, error: null });
    try {
      const { subscriptionService } = await import('../services/subscriptionService');
      const data = await subscriptionService.loadAllData();
      set({
        subscription: data.subscription,
        plans: data.plans,
        addOns: data.addOns,
        usageLimits: data.usageLimits,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh subscription',
        isLoading: false,
      });
    }
  },

  recoverPendingPayment: async () => {
    const { pendingPayment } = get();
    if (!pendingPayment || pendingPayment.status !== 'pending') {
      return;
    }

    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - pendingPayment.createdAt > fiveMinutes) {
      get().clearPendingPayment();
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { subscriptionService } = await import('../services/subscriptionService');
      const data = await subscriptionService.loadFromBootstrap();
      set({
        subscription: data.subscription,
        addOns: data.addOns,
        usageLimits: data.usageLimits,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to recover payment status',
        isLoading: false,
      });
    }
  },
}));
