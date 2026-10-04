import { syncManager, initializeSync, performSync } from '../sync/syncEngine';

describe('Sync Engine', () => {
  beforeEach(() => {
    syncManager.status = 'idle';
    syncManager.error = null;
    syncManager.lastSyncTimestamp = null;
    syncManager.pendingCount = 0;
    syncManager.conflictCount = 0;
  });

  describe('initial state', () => {
    it('should have idle status initially', () => {
      expect(syncManager.status).toBe('idle');
    });

    it('should have null error initially', () => {
      expect(syncManager.error).toBeNull();
    });

    it('should have null last sync timestamp initially', () => {
      expect(syncManager.lastSyncTimestamp).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should set cancel flag', () => {
      syncManager.cancel();
      expect(syncManager.status).toBe('idle');
    });
  });

  describe('reset', () => {
    it('should reset state to idle', () => {
      syncManager.status = 'failed';
      syncManager.error = 'Some error';
      syncManager.reset();
      expect(syncManager.status).toBe('idle');
      expect(syncManager.error).toBeNull();
    });
  });

  describe('clearConflicts', () => {
    it('should be a function', () => {
      expect(typeof syncManager.clearConflicts).toBe('function');
    });
  });

  describe('clearFailed', () => {
    it('should be a function', () => {
      expect(typeof syncManager.clearFailed).toBe('function');
    });
  });
});

describe('initializeSync', () => {
  it('should be a function', () => {
    expect(typeof initializeSync).toBe('function');
  });
});

describe('performSync', () => {
  it('should be a function', () => {
    expect(typeof performSync).toBe('function');
  });
});
