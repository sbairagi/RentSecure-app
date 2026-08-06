// @ts-nocheck
import { useRentersStore } from '../../store/rentersStore';
import { mockRenter, mockRenterListResponse } from '../../tests/mocks/data';

jest.mock('@/services/storage/mmkv');

describe('rentersStore', () => {
  beforeEach(() => {
    useRentersStore.setState({
      renters: [],
      selectedRenter: null,
      subscriptionLimits: null,
      featureAccess: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  describe('setRenters', () => {
    it('should set renters list', () => {
      useRentersStore.getState().setRenters(mockRenterListResponse.results);
      expect(useRentersStore.getState().renters).toHaveLength(1);
      expect(useRentersStore.getState().isLoading).toBe(false);
      expect(useRentersStore.getState().error).toBeNull();
    });
  });

  describe('setSelectedRenter', () => {
    it('should set selected renter', () => {
      useRentersStore.getState().setSelectedRenter(mockRenter);
      expect(useRentersStore.getState().selectedRenter).toEqual(mockRenter);
      expect(useRentersStore.getState().isLoading).toBe(false);
    });

    it('should allow null selection', () => {
      useRentersStore.getState().setSelectedRenter(null);
      expect(useRentersStore.getState().selectedRenter).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useRentersStore.getState().setLoading(true);
      expect(useRentersStore.getState().isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error and clear loading', () => {
      useRentersStore.getState().setError('Test error');
      expect(useRentersStore.getState().error).toBe('Test error');
      expect(useRentersStore.getState().isLoading).toBe(false);
    });
  });

  describe('clearRenters', () => {
    it('should reset state to initial', () => {
      useRentersStore.getState().setRenters(mockRenterListResponse.results);
      useRentersStore.getState().clearRenters();
      expect(useRentersStore.getState().renters).toHaveLength(0);
      expect(useRentersStore.getState().selectedRenter).toBeNull();
      expect(useRentersStore.getState().error).toBeNull();
    });
  });

  describe('setSubscriptionLimits', () => {
    it('should set subscription limits', () => {
      const limits = { max_renters: 10, current_renters: 1 } as any;
      useRentersStore.getState().setSubscriptionLimits(limits);
      expect(useRentersStore.getState().subscriptionLimits).toEqual(limits);
    });
  });

  describe('setFeatureAccess', () => {
    it('should set feature access', () => {
      const access = { can_create: true, can_edit: true } as any;
      useRentersStore.getState().setFeatureAccess(access);
      expect(useRentersStore.getState().featureAccess).toEqual(access);
    });
  });
});
