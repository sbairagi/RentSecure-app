import { detectConflict, hasConflict, compareVersions } from '../conflicts/conflictDetector';
import { resolveConflict, getConflictResolution, getResolutionDescription } from '../conflicts/conflictResolver';

describe('Conflict Detection', () => {
  describe('detectConflict', () => {
    it('should return null when timestamps are missing', () => {
      expect(detectConflict({}, {})).toBeNull();
      expect(detectConflict({}, {}, '2024-01-01', undefined)).toBeNull();
      expect(detectConflict({}, {}, undefined, '2024-01-01')).toBeNull();
    });

    it('should detect conflict when server is newer', () => {
      const local = { name: 'Old Name' };
      const server = { name: 'New Name' };
      const result = detectConflict(local, server, '2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z');
      expect(result).not.toBeNull();
      expect(result?.serverVersion).toEqual(server);
      expect(result?.localVersion).toEqual(local);
    });

    it('should not detect conflict when local is newer', () => {
      const local = { name: 'New Name' };
      const server = { name: 'Old Name' };
      const result = detectConflict(local, server, '2024-01-02T00:00:00Z', '2024-01-01T00:00:00Z');
      expect(result).toBeNull();
    });

    it('should not detect conflict when timestamps are equal', () => {
      const local = { name: 'Name' };
      const server = { name: 'Name' };
      const result = detectConflict(local, server, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');
      expect(result).toBeNull();
    });
  });

  describe('hasConflict', () => {
    it('should return false when timestamps are missing', () => {
      expect(hasConflict(undefined, '2024-01-01')).toBe(false);
      expect(hasConflict('2024-01-01', undefined)).toBe(false);
    });

    it('should return true when server is newer', () => {
      expect(hasConflict('2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z')).toBe(true);
    });

    it('should return false when local is newer', () => {
      expect(hasConflict('2024-01-02T00:00:00Z', '2024-01-01T00:00:00Z')).toBe(false);
    });
  });

  describe('compareVersions', () => {
    it('should identify conflicting fields', () => {
      const local = { name: 'A', status: 'active', extra: 'local' };
      const server = { name: 'B', status: 'active', other: 'server' };
      const result = compareVersions(local, server);
      expect(result.conflictingFields).toContain('name');
      expect(result.conflictingFields).not.toContain('status');
    });

    it('should merge versions', () => {
      const local = { name: 'A', extra: 'local' };
      const server = { name: 'B', other: 'server' };
      const result = compareVersions(local, server);
      expect(result.merged.name).toBe('B');
      expect(result.merged.other).toBe('server');
      expect(result.merged.extra).toBe('local');
    });
  });
});

describe('Conflict Resolution', () => {
  describe('resolveConflict', () => {
    it('should resolve with keep-server strategy', async () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: { name: 'Server' },
        localVersion: { name: 'Local' },
      };
      const result = await resolveConflict(conflict, 'keep-server');
      expect(result.resolved).toBe(true);
      expect(result.data).toEqual({ name: 'Server' });
    });

    it('should resolve with keep-local strategy', async () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: { name: 'Server' },
        localVersion: { name: 'Local' },
      };
      const result = await resolveConflict(conflict, 'keep-local');
      expect(result.resolved).toBe(true);
      expect(result.data).toEqual({ name: 'Local' });
    });

    it('should resolve with retry strategy', async () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: { name: 'Server' },
        localVersion: { name: 'Local' },
      };
      const mergeData = { name: 'Merged' };
      const result = await resolveConflict(conflict, 'retry', mergeData);
      expect(result.resolved).toBe(false);
      expect(result.data).toEqual({ name: 'Merged' });
    });

    it('should default to keep-server for unknown strategy', async () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: { name: 'Server' },
        localVersion: { name: 'Local' },
      };
      const result = await resolveConflict(conflict as any, 'unknown' as any);
      expect(result.strategy).toBe('keep-server');
    });
  });

  describe('getConflictResolution', () => {
    it('should recommend keep-server for large time difference', () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: {},
        localVersion: {},
        localUpdatedAt: '2024-01-01T00:00:00Z',
        serverUpdatedAt: '2024-01-02T02:00:00Z',
      };
      expect(getConflictResolution(conflict)).toBe('keep-server');
    });

    it('should recommend keep-local for old local changes', () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: {},
        localVersion: {},
        localUpdatedAt: '2024-01-02T00:00:00Z',
        serverUpdatedAt: '2024-01-01T00:00:00Z',
      };
      expect(getConflictResolution(conflict)).toBe('keep-local');
    });

    it('should recommend manual for many conflicting fields', () => {
      const conflict = {
        queueItemId: '1',
        resource: 'buildings',
        serverVersion: { a: 1, b: 2, c: 3, d: 4, e: 5 },
        localVersion: { a: 2, b: 3, c: 4, d: 5, e: 6 },
        localUpdatedAt: '2024-01-01T00:30:00Z',
        serverUpdatedAt: '2024-01-01T00:45:00Z',
      };
      expect(getConflictResolution(conflict)).toBe('manual');
    });
  });

  describe('getResolutionDescription', () => {
    it('should return descriptions for all strategies', () => {
      expect(getResolutionDescription('keep-server')).toContain('server version');
      expect(getResolutionDescription('keep-local')).toContain('local changes');
      expect(getResolutionDescription('retry')).toContain('merge');
      expect(getResolutionDescription('manual')).toContain('manual review');
    });
  });
});
