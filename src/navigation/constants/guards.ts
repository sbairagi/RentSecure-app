export const GUARD_PHASES = {
  LOADING: 'loading',
  CHECKING: 'checking',
  READY: 'ready',
} as const;

export const GUARD_ACTIONS = {
  REDIRECT: 'redirect',
  SHOW_ERROR: 'show_error',
  SHOW_UPGRADE: 'show_upgrade',
  NONE: 'none',
} as const;

export const DEFAULT_SUBSCRIPTION_ROLES = [
  'property_owner',
  'ca_partner',
  'admin',
  'super_admin',
] as const;

export const AUTH_ROUTE_PATHS = [
  '/splash',
  '/(auth)/welcome',
  '/(auth)/login',
  '/(auth)/register',
  '/(auth)/forgot-password',
  '/(auth)/otp',
  '/(auth)/verify-otp',
  '/(auth)/reset-password',
  '/(auth)/create-password',
  '/(auth)/biometric-setup',
  '/(auth)/session-expired',
  '/(auth)/maintenance',
] as const;

export const ERROR_SCREEN_ROUTES = {
  EXPIRED_TOKEN: '/(auth)/session-expired',
  MAINTENANCE: '/(auth)/maintenance',
  FORCE_UPDATE: '/(auth)/session-expired',
  OFFLINE: '/(auth)/session-expired',
  ACCESS_DENIED: '/(drawer)/(tabs)/dashboard',
  SUBSCRIPTION_EXPIRED: '/(drawer)/(tabs)/subscription',
} as const;

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
