export type ConnectivityStatus = 'online' | 'offline' | 'slow' | 'unknown';

export type BootstrapPhase =
  | 'idle'
  | 'checking_connectivity'
  | 'checking_maintenance'
  | 'checking_version'
  | 'validating_session'
  | 'refreshing_token'
  | 'loading_user'
  | 'loading_permissions'
  | 'loading_subscription'
  | 'loading_feature_limits'
  | 'loading_addons'
  | 'loading_dashboard'
  | 'completed'
  | 'failed';

export type BootstrapErrorType =
  | 'backend_down'
  | 'maintenance'
  | 'internet_lost'
  | 'expired_token'
  | 'version_unsupported'
  | 'permission_missing'
  | 'subscription_expired'
  | 'feature_blocked'
  | 'unknown';

export interface MaintenanceInfo {
  isMaintenance: boolean;
  message: string;
  scheduledAt?: string;
}

export interface AppVersionInfo {
  latestVersion: string;
  minSupportedVersion: string;
  isUpdateRequired: boolean;
  isOptional: boolean;
  storeUrl?: string;
}

export interface BootstrapUser {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: string;
  permissions: string[];
}

export interface SubscriptionInfo {
  id: number;
  user: number;
  plan: {
    id: number;
    name: string;
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

export interface AddOnInfo {
  id: number;
  user: number;
  name: string;
  amount: string;
  is_recurring: boolean;
  purchase_date: string;
}

export interface FeatureLimitInfo {
  id: number;
  user: number;
  feature_key: string;
  usage_count: number;
  updated_at: string;
}

export interface DashboardSummary {
  total_rent_collected: number;
  rent_collected_this_month: number;
  tax_paid_this_month: number;
  pending_rent: number;
  payouts: {
    success: number;
    pending: number;
    failed: number;
  };
  upcoming_tax_dues: any[];
  rent_payment_trends: any[];
  monthly_rent_trend: any[];
  monthly_tax_trend: any[];
  rent_defaulters: any[];
}

export interface BootstrapResponse {
  maintenance: MaintenanceInfo;
  appVersion: AppVersionInfo;
  user?: BootstrapUser;
  subscription?: SubscriptionInfo | null;
  addOns?: AddOnInfo[];
  featureLimits?: FeatureLimitInfo[];
  dashboardSummary?: DashboardSummary | null;
}

export interface BootstrapState {
  isInitialized: boolean;
  isOnline: boolean;
  isMaintenance: boolean;
  isForceUpdate: boolean;
  appVersion: string;
  backendVersion: string;
  maintenanceMessage: string;
  maintenanceScheduledAt?: string;
  permissions: string[];
  subscription: SubscriptionInfo | null;
  featureLimits: FeatureLimitInfo[];
  addons: AddOnInfo[];
  dashboardSummary: DashboardSummary | null;
  currentPhase: BootstrapPhase;
  error: BootstrapErrorType | null;
  errorMessage: string;
  retryCount: number;
}

export interface BootstrapActions {
  initialize: () => Promise<void>;
  reload: () => Promise<void>;
  reset: () => void;
  setPhase: (phase: BootstrapPhase) => void;
  setError: (error: BootstrapErrorType | null, message?: string) => void;
  setOnline: (online: boolean) => void;
}

export type BootstrapStore = BootstrapState & BootstrapActions;

export interface BootstrapProgress {
  phase: BootstrapPhase;
  label: string;
  description: string;
}
