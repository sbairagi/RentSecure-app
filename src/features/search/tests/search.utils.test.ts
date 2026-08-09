// @ts-nocheck
import {
  formatRelativeTime,
  getResourceTypeColor,
  getResourceTypeIcon,
  getResourceTypeLabel,
  buildNavigationTarget,
  isDeepLinkAvailable,
  getResourceTypeBadgeStyle,
} from '../utils/search.utils';

describe('search.utils', () => {
  describe('formatRelativeTime', () => {
    it('returns "Just now" for very recent times', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('Just now');
    });

    it('returns minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatRelativeTime(date)).toBe('5m ago');
    });

    it('returns hours ago', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(date)).toBe('3h ago');
    });

    it('returns days ago', () => {
      const date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(date)).toBe('4d ago');
    });

    it('returns "Unknown" for null', () => {
      expect(formatRelativeTime(null)).toBe('Unknown');
    });

    it('returns formatted date for older dates', () => {
      const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeTime(date);
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
    });
  });

  describe('getResourceTypeColor', () => {
    it('returns correct color for buildings', () => {
      expect(getResourceTypeColor('buildings')).toBe('#2563EB');
    });

    it('returns default color for unknown type', () => {
      expect(getResourceTypeColor('unknown_type')).toBe('#6B7280');
    });
  });

  describe('getResourceTypeIcon', () => {
    it('returns correct icon for buildings', () => {
      expect(getResourceTypeIcon('buildings')).toBe('🏢');
    });

    it('returns default icon for unknown type', () => {
      expect(getResourceTypeIcon('unknown_type')).toBe('📄');
    });
  });

  describe('getResourceTypeLabel', () => {
    it('returns correct label for buildings', () => {
      expect(getResourceTypeLabel('buildings')).toBe('Buildings');
    });
  });

  describe('buildNavigationTarget', () => {
    it('builds correct route for buildings', () => {
      const result = {
        resource_type: 'buildings' as const,
        id: 5,
        title: 'Test Building',
        subtitle: 'Test',
        status: 'active',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: 'buildings-detail',
      };
      expect(buildNavigationTarget(result)).toBe('/(drawer)/(tabs)/buildings/5');
    });

    it('builds correct route for units', () => {
      const result = {
        resource_type: 'units' as const,
        id: 10,
        title: 'Unit 101',
        subtitle: 'Test',
        status: 'occupied',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: 'units-detail',
      };
      expect(buildNavigationTarget(result)).toBe('/(drawer)/(tabs)/units/10');
    });

    it('returns empty for agreements (no detail route)', () => {
      const result = {
        resource_type: 'agreements' as const,
        id: 1,
        title: 'Test Agreement',
        subtitle: 'Test',
        status: 'draft',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: null,
      };
      expect(buildNavigationTarget(result)).toBe('');
    });

    it('returns payments route for rent_records', () => {
      const result = {
        resource_type: 'rent_records' as const,
        id: 1,
        title: 'Rent Record',
        subtitle: 'Test',
        status: 'paid',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: null,
      };
      expect(buildNavigationTarget(result)).toBe('');
    });
  });

  describe('isDeepLinkAvailable', () => {
    it('returns true for buildings', () => {
      const result = {
        resource_type: 'buildings' as const,
        id: 1,
        title: 'Test',
        subtitle: 'Test',
        status: 'active',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: 'buildings-detail',
      };
      expect(isDeepLinkAvailable(result)).toBe(true);
    });

    it('returns false for agreements', () => {
      const result = {
        resource_type: 'agreements' as const,
        id: 1,
        title: 'Test',
        subtitle: 'Test',
        status: 'draft',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: null,
      };
      expect(isDeepLinkAvailable(result)).toBe(false);
    });

    it('returns false for rent_records', () => {
      const result = {
        resource_type: 'rent_records' as const,
        id: 1,
        title: 'Test',
        subtitle: 'Test',
        status: 'paid',
        metadata: {},
        last_updated: new Date().toISOString(),
        navigation_target: null,
      };
      expect(isDeepLinkAvailable(result)).toBe(false);
    });
  });

  describe('getResourceTypeBadgeStyle', () => {
    it('returns color and backgroundColor', () => {
      const style = getResourceTypeBadgeStyle('buildings');
      expect(style.color).toBe('#2563EB');
      expect(style.backgroundColor).toBe('#2563EB15');
    });
  });
});
