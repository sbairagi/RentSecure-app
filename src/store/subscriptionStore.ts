import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export interface Subscription {
  id: number;
  user: number;
  plan: {
    id: number;
    name: SubscriptionPlan;
    monthly_price: string;
    yearly_price: string;
    features: string;
    is_active: boolean;
  };
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_yearly: boolean;
  tax_reminder_days_before: number;
  rent_reminder_days_before: number;
  created_at: string;
  updated_at: string;
}

export interface AddOnPurchase {
  id: number;
  user: number;
  name: string;
  amount: string;
  is_recurring: boolean;
  purchase_date: string;
}

export interface UsageLimit {
  id: number;
  user: number;
  feature_key: string;
  usage_count: number;
  updated_at: string;
}

export interface SubscriptionPlanDetail {
  id: number;
  name: SubscriptionPlan;
  monthly_price: string;
  yearly_price: string;
  features: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  plans: SubscriptionPlanDetail[];
  addOns: AddOnPurchase[];
  usageLimits: UsageLimit[];
  isLoading: boolean;
  error: string | null;
}

export interface SubscriptionActions {
  setSubscription: (subscription: Subscription | null) => void;
  setPlans: (plans: SubscriptionPlanDetail[]) => void;
  setAddOns: (addOns: AddOnPurchase[]) => void;
  setUsageLimits: (limits: UsageLimit[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSubscription: () => void;
  initSubscription: () => Promise<void>;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

const initialState: SubscriptionState = {
  subscription: null,
  plans: [],
  addOns: [],
  usageLimits: [],
  isLoading: true,
  error: null,
};

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  ...initialState,

  setSubscription: (subscription) =>
    set({
      subscription,
      isLoading: false,
      error: null,
    }),

  setPlans: (plans) =>
    set((state) => ({
      plans,
      isLoading: false,
    })),

  setAddOns: (addOns) =>
    set({
      addOns,
    }),

  setUsageLimits: (usageLimits) =>
    set({
      usageLimits,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearSubscription: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  initSubscription: async () => {
    try {
      const stored = await mmkvStorage.getItem('subscription');
      if (stored) {
        set({ subscription: JSON.parse(stored), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to init subscription:', error);
      set({ isLoading: false, error: 'Failed to load subscription' });
    }
  },
}));
