import {
  getSyncStatusLabel,
  getSyncStatusColor,
  getSyncStatusIcon,
  formatSyncResult,
} from '../utils/syncStatus';

describe('Sync Status Utils', () => {
  describe('getSyncStatusLabel', () => {
    it('should return labels for all statuses', () => {
      expect(getSyncStatusLabel('syncing')).toBe('Syncing');
      expect(getSyncStatusLabel('success')).toBe('Synced');
      expect(getSyncStatusLabel('failed')).toBe('Sync failed');
      expect(getSyncStatusLabel('conflict')).toBe('Sync conflict');
      expect(getSyncStatusLabel('idle')).toBe('');
    });
  });

  describe('getSyncStatusColor', () => {
    it('should return colors for all statuses', () => {
      expect(getSyncStatusColor('syncing')).toBe('#92400e');
      expect(getSyncStatusColor('success')).toBe('#166534');
      expect(getSyncStatusColor('failed')).toBe('#991b1b');
      expect(getSyncStatusColor('conflict')).toBe('#92400e');
      expect(getSyncStatusColor('idle')).toBe('#64748b');
    });
  });

  describe('getSyncStatusIcon', () => {
    it('should return icons for all statuses', () => {
      expect(getSyncStatusIcon('syncing')).toBe('⟳');
      expect(getSyncStatusIcon('success')).toBe('✓');
      expect(getSyncStatusIcon('failed')).toBe('✕');
      expect(getSyncStatusIcon('conflict')).toBe('⚠');
      expect(getSyncStatusIcon('idle')).toBe('');
    });
  });

  describe('formatSyncResult', () => {
    it('should format empty result', () => {
      expect(formatSyncResult({ total: 0, succeeded: 0, failed: 0, conflicts: 0 })).toBe(
        'No changes to sync'
      );
    });

    it('should format success result', () => {
      expect(formatSyncResult({ total: 3, succeeded: 3, failed: 0, conflicts: 0 })).toBe(
        '3 synced'
      );
    });

    it('should format mixed result', () => {
      expect(formatSyncResult({ total: 5, succeeded: 3, failed: 1, conflicts: 1 })).toBe(
        '3 synced, 1 failed, 1 conflicts'
      );
    });
  });
});
