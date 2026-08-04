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
  | 'notification:write';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
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

export const hasPermission = (role: string, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (role: string, permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(role, permission));
};

export const hasAllPermissions = (role: string, permissions: Permission[]): boolean => {
  return permissions.every((permission) => hasPermission(role, permission));
};
