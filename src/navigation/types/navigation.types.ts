export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'property_owner'
  | 'renter'
  | 'caretaker'
  | 'ca_partner'
  | 'support_executive'
  | 'user';

export const BACKEND_ROLE_MAP: Record<string, UserRole> = {
  owner: 'property_owner',
  renter: 'renter',
  caretaker: 'caretaker',
  user: 'user',
  ca: 'ca_partner',
};

export const mapBackendRole = (backendRole: string | null | undefined): UserRole => {
  if (!backendRole) return 'user';
  return BACKEND_ROLE_MAP[backendRole] || 'user';
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  property_owner: 'Property Owner',
  renter: 'Renter',
  caretaker: 'Caretaker',
  ca_partner: 'CA Partner',
  support_executive: 'Support Executive',
  user: 'User',
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 7,
  admin: 6,
  property_owner: 5,
  ca_partner: 4,
  caretaker: 3,
  support_executive: 2,
  renter: 1,
  user: 0,
};

export type TabName = 'dashboard' | 'properties' | 'payments' | 'notifications' | 'profile';

export interface TabConfig {
  name: TabName;
  title: string;
  icon: string;
  href: string;
  requiredPermission?: string;
  minRoleLevel?: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  isExpired: boolean;
  planName: string;
  endDate: string | null;
  daysRemaining: number | null;
}

export interface FeatureLimit {
  featureKey: string;
  currentUsage: number;
  limit: number | 'unlimited';
  canUse: boolean;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  navigationTimestamp: number | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  requiresUpdate: boolean;
  updateType: 'required' | 'optional' | null;
  latestVersion: string;
}

export type GuardAction = 'redirect' | 'show_error' | 'show_upgrade' | 'none';

export interface GuardResult {
  allowed: boolean;
  action: GuardAction;
  redirectTo?: string;
  message?: string;
}

export type Permission =
  | 'dashboard:read'
  | 'property:read'
  | 'property:write'
  | 'building:read'
  | 'building:write'
  | 'unit:read'
  | 'unit:write'
  | 'renter:read'
  | 'renter:write'
  | 'caretaker:read'
  | 'caretaker:write'
  | 'payment:read'
  | 'payment:write'
  | 'report:read'
  | 'report:write'
  | 'settings:read'
  | 'settings:write'
  | 'user:read'
  | 'user:write'
  | 'subscription:read'
  | 'subscription:write'
  | 'agreement:read'
  | 'agreement:write'
  | 'notification:read'
  | 'notification:write'
  | 'maintenance:read'
  | 'maintenance:write'
  | 'ai:read'
  | 'document:read'
  | 'document:write';

export type DeepLinkType =
  | 'payment'
  | 'invitation'
  | 'agreement'
  | 'rent_record'
  | 'notification'
  | 'building'
  | 'unit'
  | 'renter'
  | 'caretaker'
  | 'maintenance'
  | 'visitor'
  | 'document'
  | 'subscription'
  | 'general';

export interface DeepLinkPayload {
  type: DeepLinkType;
  id?: string;
  token?: string;
  action?: string;
  [key: string]: any;
}
