export type ThemeMode = 'light' | 'dark' | 'system';

export interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  permissions: string[];
  username?: string;
  is_phone_verified?: boolean;
}

export interface UpdateProfileData {
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AlertPreferences {
  language_preference: string;
  alert_frequency: string;
  receive_rent_alerts: boolean;
  receive_tax_alerts: boolean;
  receive_vacancy_alerts: boolean;
  receive_flagged_alerts: boolean;
  receive_voice_alerts: boolean;
  greeting_prefix: string;
  reminder_time: string;
  rent_reminders_enabled: boolean;
}

export interface NotificationPreference {
  push_enabled: boolean;
  rent_alerts_push: boolean;
  rent_alerts_whatsapp: boolean;
  rent_alerts_email: boolean;
  monthly_summary_email: boolean;
  monthly_summary_whatsapp: boolean;
  payout_alerts_whatsapp: boolean;
  payout_alerts_email: boolean;
  maintenance_push: boolean;
  visitor_push: boolean;
  agreement_push: boolean;
  subscription_push: boolean;
  system_push: boolean;
  receive_rent_alerts: boolean;
  receive_tax_alerts: boolean;
  receive_vacancy_alerts: boolean;
  receive_flagged_alerts: boolean;
  receive_voice_alerts: boolean;
  language_preference: string;
  alert_frequency: string;
  greeting_prefix: string;
  reminder_time: string;
  rent_reminders_enabled: boolean;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: string;
  yearly_price: string;
  features: string;
  is_active: boolean;
}

export interface UserSubscription {
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

export interface DeviceInfo {
  id?: number;
  deviceId: string;
  deviceModel: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
  osVersion: string;
  appVersion: string;
  buildVersion: string;
  lastActive?: string;
  createdAt?: string;
  isCurrentDevice?: boolean;
}

export interface SettingsSectionData {
  id: string;
  title: string;
  description?: string;
  items: SettingsItemData[];
}

export interface SettingsItemData {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  type: 'toggle' | 'navigate' | 'info' | 'danger' | 'select';
  value?: boolean | string;
  options?: { label: string; value: string }[];
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface DeleteAccountState {
  step: 'idle' | 'confirming' | 'deleting' | 'done' | 'error';
  error?: string;
}
