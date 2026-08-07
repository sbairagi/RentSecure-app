import type { Permission, UserRole } from '@/navigation/types/navigation.types';

export const FEATURE_PERMISSIONS: Record<string, Permission[]> = {
  buildings: ['building:read', 'building:write'],
  units: ['unit:read', 'unit:write'],
  renters: ['renter:read', 'renter:write'],
  caretakers: ['caretaker:read', 'caretaker:write'],
  'rent-records': ['payment:read', 'payment:write'],
  payments: ['payment:read', 'payment:write'],
  invoices: ['payment:read', 'payment:write'],
  agreements: ['agreement:read', 'agreement:write'],
  documents: ['agreement:read'],
  reports: ['report:read'],
  subscription: ['subscription:read', 'subscription:write'],
  settings: ['settings:read', 'settings:write'],
  notifications: ['notification:read', 'notification:write'],
  support: ['dashboard:read'],
  dashboard: ['dashboard:read'],
  properties: ['property:read', 'property:write'],
  maintenance: ['maintenance:read', 'maintenance:write'],
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'dashboard:read',
    'property:read',
    'property:write',
    'building:read',
    'building:write',
    'unit:read',
    'unit:write',
    'renter:read',
    'renter:write',
    'caretaker:read',
    'caretaker:write',
    'payment:read',
    'payment:write',
    'report:read',
    'report:write',
    'settings:read',
    'settings:write',
    'user:read',
    'user:write',
    'subscription:read',
    'subscription:write',
    'agreement:read',
    'agreement:write',
    'notification:read',
    'notification:write',
    'maintenance:read',
    'maintenance:write',
  ],
  admin: [
    'dashboard:read',
    'property:read',
    'property:write',
    'building:read',
    'building:write',
    'unit:read',
    'unit:write',
    'renter:read',
    'renter:write',
    'caretaker:read',
    'caretaker:write',
    'payment:read',
    'payment:write',
    'report:read',
    'report:write',
    'settings:read',
    'settings:write',
    'user:read',
    'user:write',
    'subscription:read',
    'agreement:read',
    'agreement:write',
    'notification:read',
    'notification:write',
    'maintenance:read',
    'maintenance:write',
  ],
  property_owner: [
    'dashboard:read',
    'property:read',
    'property:write',
    'building:read',
    'building:write',
    'unit:read',
    'unit:write',
    'renter:read',
    'renter:write',
    'caretaker:read',
    'caretaker:write',
    'payment:read',
    'payment:write',
    'report:read',
    'settings:read',
    'settings:write',
    'subscription:read',
    'subscription:write',
    'agreement:read',
    'agreement:write',
    'notification:read',
    'notification:write',
    'maintenance:read',
    'maintenance:write',
  ],
  ca_partner: [
    'dashboard:read',
    'property:read',
    'renter:read',
    'payment:read',
    'report:read',
    'agreement:read',
    'agreement:write',
    'notification:read',
  ],
  caretaker: [
    'dashboard:read',
    'property:read',
    'building:read',
    'unit:read',
    'renter:read',
    'report:read',
    'agreement:read',
    'notification:read',
    'notification:write',
  ],
  support_executive: [
    'dashboard:read',
    'property:read',
    'renter:read',
    'payment:read',
    'report:read',
    'notification:read',
    'notification:write',
  ],
  renter: ['dashboard:read', 'agreement:read', 'payment:read', 'notification:read'],
  user: [],
};

export const hasPermission = (
  role: UserRole | null | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (
  role: UserRole | null | undefined,
  permissions: Permission[]
): boolean => {
  if (!role || permissions.length === 0) return false;
  const userPerms = ROLE_PERMISSIONS[role] || [];
  return permissions.some((p) => userPerms.includes(p));
};

export const hasAllPermissions = (
  role: UserRole | null | undefined,
  permissions: Permission[]
): boolean => {
  if (!role || permissions.length === 0) return false;
  const userPerms = ROLE_PERMISSIONS[role] || [];
  return permissions.every((p) => userPerms.includes(p));
};

export const getRequiredPermissions = (featureKey: string): Permission[] => {
  return FEATURE_PERMISSIONS[featureKey] || [];
};

export const canAccessFeature = (
  role: UserRole | null | undefined,
  featureKey: string
): boolean => {
  if (!role) return false;
  const userPerms = ROLE_PERMISSIONS[role] || [];

  if (featureKey === '*') return true;

  const requiredPerms = FEATURE_PERMISSIONS[featureKey] || [];
  if (requiredPerms.length === 0) return true;
  const hasWildcard = requiredPerms.some((p) => p === ('*' as Permission));
  if (hasWildcard) return true;

  return requiredPerms.some((p: Permission) => userPerms.includes(p));
};
