// Match backend plan names EXACTLY: free, pro, elite
export type PlanName = 'free' | 'pro' | 'elite';

export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: number;
  name: PlanName;
  monthly_price: string;
  yearly_price: string;
  features: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserSubscription {
  id: number;
  user: number;
  plan: SubscriptionPlan | null;
  start_date: string;
  end_date: string | null;
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

export interface PlanFeatureLimit {
  id: number;
  plan: number;
  feature_key: string;
  value: string;
}

export interface UsageLimit {
  id: number;
  user: number;
  feature_key: string;
  usage_count: number;
  updated_at: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  isExpired: boolean;
  planName: PlanName;
  endDate: string | null;
  daysRemaining: number | null;
  isInGracePeriod: boolean;
}

export interface EffectiveLimit {
  featureKey: string;
  planLimit: number | 'unlimited';
  addOnLimit: number;
  effectiveLimit: number | 'unlimited';
  currentUsage: number;
  remaining: number | 'unlimited';
  percentageUsed: number;
  canUse: boolean;
}

export interface SubscriptionInfo {
  subscription: UserSubscription | null;
  plans: SubscriptionPlan[];
  addOns: AddOnPurchase[];
  usageLimits: UsageLimit[];
  featureLimits: PlanFeatureLimit[];
  effectiveLimits: EffectiveLimit[];
}
