import type { UserRole, Permission } from '../types';

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
    'ai:read',
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
    'ai:read',
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
    'ai:read',
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
    'ai:read',
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
    'ai:read',
  ],
  support_executive: [
    'dashboard:read',
    'property:read',
    'renter:read',
    'payment:read',
    'report:read',
    'notification:read',
    'notification:write',
    'ai:read',
  ],
  renter: [
    'dashboard:read',
    'agreement:read',
    'payment:read',
    'notification:read',
    'ai:read',
  ],
  user: [],
};

export class RoleChecker {
  static hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  static hasAnyPermission(
    role: UserRole | null | undefined,
    permissions: Permission[]
  ): boolean {
    if (!role || permissions.length === 0) return false;
    const userPerms = ROLE_PERMISSIONS[role] || [];
    return permissions.some((p) => userPerms.includes(p));
  }

  static hasAllPermissions(
    role: UserRole | null | undefined,
    permissions: Permission[]
  ): boolean {
    if (!role || permissions.length === 0) return false;
    const userPerms = ROLE_PERMISSIONS[role] || [];
    return permissions.every((p) => userPerms.includes(p));
  }

  static hasRoleLevel(
    role: UserRole | null | undefined,
    minLevel: number
  ): boolean {
    if (!role) return false;
    const level = ROLE_HIERARCHY[role] || 0;
    return level >= minLevel;
  }

  static canAccessFeature(
    role: UserRole | null | undefined,
    featureKey: string,
    featurePermissions: Record<string, Permission[]>
  ): boolean {
    if (!role) return false;
    const userPerms = ROLE_PERMISSIONS[role] || [];

    if (featureKey === '*') return true;

    const requiredPerms = featurePermissions[featureKey] || [];
    if (requiredPerms.length === 0) return true;

    const hasWildcard = requiredPerms.some((p) => p === ('*' as Permission));
    if (hasWildcard) return true;

    return requiredPerms.some((p) => userPerms.includes(p));
  }

  static getRoleDisplayName(role: UserRole | null | undefined): string {
    const labels: Record<UserRole, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      property_owner: 'Property Owner',
      renter: 'Renter',
      caretaker: 'Caretaker',
      ca_partner: 'CA Partner',
      support_executive: 'Support Executive',
      user: 'User',
    };
    return role ? labels[role] || 'User' : 'User';
  }
}
