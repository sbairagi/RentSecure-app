import { RoleChecker } from '../permissions/roleChecker';
import type { Permission } from '../types';

describe('RoleChecker', () => {
  describe('hasPermission', () => {
    it('should return false for null role', () => {
      expect(RoleChecker.hasPermission(null, 'dashboard:read')).toBe(false);
    });

    it('should return false for undefined role', () => {
      expect(RoleChecker.hasPermission(undefined, 'dashboard:read')).toBe(false);
    });

    it('should return true when role has permission', () => {
      expect(RoleChecker.hasPermission('property_owner', 'dashboard:read')).toBe(true);
      expect(RoleChecker.hasPermission('property_owner', 'payment:write')).toBe(true);
    });

    it('should return false when role lacks permission', () => {
      expect(RoleChecker.hasPermission('renter', 'property:write')).toBe(false);
      expect(RoleChecker.hasPermission('user', 'dashboard:read')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if any permission matches', () => {
      expect(
        RoleChecker.hasAnyPermission('property_owner', ['payment:read', 'property:write'])
      ).toBe(true);
    });

    it('should return false if no permissions match', () => {
      expect(RoleChecker.hasAnyPermission('renter', ['property:write', 'building:write'])).toBe(
        false
      );
    });

    it('should return false for empty permissions array', () => {
      expect(RoleChecker.hasAnyPermission('property_owner', [])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if all permissions match', () => {
      expect(
        RoleChecker.hasAllPermissions('property_owner', ['dashboard:read', 'property:read'])
      ).toBe(true);
    });

    it('should return false if any permission is missing', () => {
      expect(
        RoleChecker.hasAllPermissions('renter', ['dashboard:read', 'property:write'])
      ).toBe(false);
    });
  });

  describe('hasRoleLevel', () => {
    it('should return true for equal or higher role level', () => {
      expect(RoleChecker.hasRoleLevel('property_owner', 5)).toBe(true);
      expect(RoleChecker.hasRoleLevel('super_admin', 3)).toBe(true);
    });

    it('should return false for lower role level', () => {
      expect(RoleChecker.hasRoleLevel('renter', 3)).toBe(false);
      expect(RoleChecker.hasRoleLevel('user', 1)).toBe(false);
    });

    it('should return false for null role', () => {
      expect(RoleChecker.hasRoleLevel(null, 1)).toBe(false);
    });
  });

  describe('canAccessFeature', () => {
    const featurePermissions: Record<string, Permission[]> = {
      buildings: ['building:read', 'building:write'],
      payments: ['payment:read', 'payment:write'],
      reports: ['report:read'],
    };

    it('should return true for wildcard', () => {
      expect(RoleChecker.canAccessFeature('property_owner', '*', featurePermissions)).toBe(true);
    });

    it('should return true when role has required permissions', () => {
      expect(RoleChecker.canAccessFeature('property_owner', 'buildings', featurePermissions)).toBe(
        true
      );
    });

    it('should return false when role lacks required permissions', () => {
      expect(RoleChecker.canAccessFeature('renter', 'buildings', featurePermissions)).toBe(false);
    });

    it('should return true for unknown feature', () => {
      expect(RoleChecker.canAccessFeature('renter', 'unknown_feature', featurePermissions)).toBe(
        true
      );
    });
  });

  describe('getRoleDisplayName', () => {
    it('should return display names', () => {
      expect(RoleChecker.getRoleDisplayName('property_owner')).toBe('Property Owner');
      expect(RoleChecker.getRoleDisplayName('super_admin')).toBe('Super Admin');
      expect(RoleChecker.getRoleDisplayName('renter')).toBe('Renter');
    });

    it('should return User for null/undefined', () => {
      expect(RoleChecker.getRoleDisplayName(null)).toBe('User');
      expect(RoleChecker.getRoleDisplayName(undefined)).toBe('User');
    });
  });
});
