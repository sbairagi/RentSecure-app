export interface DashboardStats {
  total_buildings: number;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  active_renters: number;
  caretakers: number;
  monthly_collection: number;
  pending_collection: number;
  occupancy_rate: number;
}

export interface MonthlyTrendItem {
  month: string;
  amount: number;
}

export interface OccupancyTrendItem {
  month: string;
  rate: number;
}

export interface RecentRentPayment {
  id: number;
  renter_name: string;
  unit_name: string;
  building_name: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method: string;
}

export interface RecentTenant {
  id: number;
  name: string;
  phone: string;
  unit_name: string;
  building_name: string;
  status: string;
  start_date: string;
  rent_amount: number;
}

export interface RecentAgreement {
  id: number;
  renter_name: string;
  unit_name: string;
  generated_at: string;
  owner_signed: boolean;
  renter_signed: boolean;
}

export interface DashboardNotification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface RentDueTodayItem {
  id: number;
  renter_name: string;
  unit_name: string;
  amount: number;
  due_date: string;
}

export interface PendingPayoutItem {
  id: number;
  renter_name: string;
  unit_name: string;
  amount: number;
  payout_status: string;
}

export interface PendingTasks {
  rent_due_today: RentDueTodayItem[];
  agreements_expiring: RecentAgreement[];
  pending_verification: number;
  maintenance_requests: any[];
  pending_payouts: PendingPayoutItem[];
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: string;
  yearly_price: string;
  features: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  is_active_subscription: boolean;
  is_yearly: boolean;
  is_subscription_expired: boolean;
}

export interface PlanLimit {
  feature_key: string;
  value: string;
}

export interface FeatureUsage {
  feature_key: string;
  usage_count: number;
  updated_at: string;
}

export interface Payouts {
  success: number;
  pending: number;
  failed: number;
}

export interface DashboardAnalytics {
  monthly_rent_collection: MonthlyTrendItem[];
  occupancy_rate: number;
  occupancy_trend: OccupancyTrendItem[];
  revenue_trend: MonthlyTrendItem[];
  collection_trend: MonthlyTrendItem[];
}

export interface DashboardResponse {
  stats: DashboardStats;
  analytics: DashboardAnalytics;
  recent: {
    rent_payments: RecentRentPayment[];
    tenants: RecentTenant[];
    agreements: RecentAgreement[];
    notifications: DashboardNotification[];
  };
  pending_tasks: PendingTasks;
  notifications: {
    preview: DashboardNotification[];
    unread_count: number;
  };
  subscription: SubscriptionPlan | null;
  plan_limits: PlanLimit[];
  feature_usage: FeatureUsage[];
  payouts: Payouts;
}

export interface DashboardSummary {
  total_rent_collected: number;
  rent_collected_this_month: number;
  tax_paid_this_month: number;
  pending_rent: number;
  payouts: Payouts;
  upcoming_tax_dues: any[];
  rent_payment_trends: { month: string; total: number }[];
  monthly_rent_trend: MonthlyTrendItem[];
  monthly_tax_trend: MonthlyTrendItem[];
  rent_defaulters: any[];
}

export type DashboardErrorCode =
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
