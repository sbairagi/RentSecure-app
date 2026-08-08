import { ROLE_HIERARCHY } from '@/constants/auth.constants';
import type { UserRole } from '@/navigation/types/navigation.types';

export const ROLE_REDIRECT: Record<UserRole, string> = {
  super_admin: '/(drawer)/(tabs)/dashboard',
  admin: '/(drawer)/(tabs)/dashboard',
  property_owner: '/(drawer)/(tabs)/dashboard',
  renter: '/(drawer)/(tabs)/dashboard',
  caretaker: '/(drawer)/(tabs)/dashboard',
  ca_partner: '/(drawer)/(tabs)/dashboard',
  support_executive: '/(drawer)/(tabs)/dashboard',
  user: '/(auth)/welcome',
};

export const ROLE_TAB_ACCESS: Record<
  UserRole,
  ('dashboard' | 'properties' | 'payments' | 'notifications' | 'profile' | 'visitors')[]
> = {
  super_admin: ['dashboard', 'properties', 'payments', 'notifications', 'profile', 'visitors'],
  admin: ['dashboard', 'properties', 'payments', 'notifications', 'profile', 'visitors'],
  property_owner: ['dashboard', 'properties', 'visitors', 'payments', 'notifications', 'profile'],
  renter: ['dashboard', 'notifications', 'profile'],
  caretaker: ['dashboard', 'properties', 'visitors', 'notifications', 'profile'],
  ca_partner: ['dashboard', 'properties', 'notifications', 'profile'],
  support_executive: ['dashboard', 'notifications', 'profile'],
  user: [],
};

export const ROLE_EXTRA_ROUTES: Record<UserRole, string[]> = {
  super_admin: ['/(drawer)/(tabs)/settings', '/(drawer)/(tabs)/support'],
  admin: ['/(drawer)/(tabs)/settings', '/(drawer)/(tabs)/support'],
  property_owner: [
    '/(drawer)/(tabs)/settings',
    '/(drawer)/(tabs)/support',
    '/(drawer)/(tabs)/subscription',
    '/(drawer)/(tabs)/reports',
    '/(drawer)/(tabs)/agreements',
  ],
  renter: ['/(drawer)/(tabs)/settings'],
  caretaker: ['/(drawer)/(tabs)/settings'],
  ca_partner: [
    '/(drawer)/(tabs)/settings',
    '/(drawer)/(tabs)/reports',
    '/(drawer)/(tabs)/agreements',
  ],
  support_executive: ['/(drawer)/(tabs)/settings', '/(drawer)/(tabs)/support'],
  user: [],
};

export const ROLE_FEATURE_ACCESS: Record<UserRole, string[]> = {
  super_admin: ['*'],
  admin: ['*'],
  property_owner: [
    'buildings',
    'units',
    'renters',
    'caretakers',
    'visitors',
    'rent-records',
    'payments',
    'invoices',
    'agreements',
    'documents',
    'reports',
    'subscription',
    'settings',
    'notifications',
    'support',
    'maintenance',
  ],
  renter: ['rent-records', 'payments', 'agreements', 'notifications', 'settings', 'maintenance'],
  caretaker: ['buildings', 'units', 'renters', 'visitors', 'reports', 'notifications', 'settings', 'maintenance'],
  ca_partner: [
    'properties',
    'renters',
    'reports',
    'agreements',
    'notifications',
    'settings',
  ],
  support_executive: [
    'dashboard',
    'properties',
    'renters',
    'payments',
    'reports',
    'notifications',
    'settings',
    'support',
    'maintenance',
  ],
  user: [],
};

export const hasRoleAccess = (
  role: UserRole | null | undefined,
  requiredRoles: (UserRole | '*')[]
): boolean => {
  if (!role) return false;
  if (requiredRoles.includes('*')) return true;
  if (requiredRoles.length === 0) return true;
  return requiredRoles.includes(role);
};

export const canAccessFeature = (role: UserRole | null | undefined, feature: string): boolean => {
  if (!role) return false;
  const features = ROLE_FEATURE_ACCESS[role] || [];
  return features.includes('*') || features.includes(feature);
};

export const getMinimumRoleLevel = (requiredLevel: number): UserRole | null => {
  let bestMatch: UserRole | null = null;
  let bestLevel = -1;
  for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
    if (level >= requiredLevel && level > bestLevel) {
      bestLevel = level;
      bestMatch = role as UserRole;
    }
  }
  return bestMatch;
};
