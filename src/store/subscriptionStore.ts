import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  features: string[];
  limits: {
    properties: number;
    units: number;
    renters: number;
  };
}

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
}

interface SubscriptionActions {
  setSubscription: (subscription: Subscription) => void;
  updateSubscription: (data: Partial<Subscription>) => void;
  setLoading: (loading: boolean) => void;
  initSubscription: () => Promise<void>;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

export const useSubscriptionStore = create<SubscriptionStore>((set, _get) => ({
  subscription: null,
  isLoading: true,

  setSubscription: (subscription) => set({ subscription, isLoading: false }),

  updateSubscription: (data) =>
    set((state) => ({
      subscription: state.subscription ? { ...state.subscription, ...data } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

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
      set({ isLoading: false });
    }
  },
}));
