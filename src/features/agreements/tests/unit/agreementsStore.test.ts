// @ts-nocheck
import { useAgreementsStore } from '../../store/agreementsStore';
import { mockAgreement, mockAgreementListResponse } from '../../tests/mocks/data';

jest.mock('@/services/storage/mmkv');

describe('agreementsStore', () => {
  beforeEach(() => {
    useAgreementsStore.setState({
      agreements: [],
      selectedAgreement: null,
      subscriptionLimits: null,
      featureAccess: null,
      filters: {},
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  describe('setAgreements', () => {
    it('should set agreements list', () => {
      useAgreementsStore.getState().setAgreements(mockAgreementListResponse.results);
      expect(useAgreementsStore.getState().agreements).toHaveLength(1);
      expect(useAgreementsStore.getState().isLoading).toBe(false);
      expect(useAgreementsStore.getState().error).toBeNull();
    });
  });

  describe('setSelectedAgreement', () => {
    it('should set selected agreement', () => {
      useAgreementsStore.getState().setSelectedAgreement(mockAgreement);
      expect(useAgreementsStore.getState().selectedAgreement).toEqual(mockAgreement);
      expect(useAgreementsStore.getState().isLoading).toBe(false);
    });

    it('should allow null selection', () => {
      useAgreementsStore.getState().setSelectedAgreement(null);
      expect(useAgreementsStore.getState().selectedAgreement).toBeNull();
    });
  });

  describe('setFilters', () => {
    it('should update filters', () => {
      useAgreementsStore.getState().setFilters({ status: 'active' });
      expect(useAgreementsStore.getState().filters.status).toBe('active');
    });

    it('should merge filters', () => {
      useAgreementsStore.getState().setFilters({ status: 'active' });
      useAgreementsStore.getState().setFilters({ search: 'test' });
      expect(useAgreementsStore.getState().filters.status).toBe('active');
      expect(useAgreementsStore.getState().filters.search).toBe('test');
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useAgreementsStore.getState().setLoading(true);
      expect(useAgreementsStore.getState().isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error and clear loading', () => {
      useAgreementsStore.getState().setError('Test error');
      expect(useAgreementsStore.getState().error).toBe('Test error');
      expect(useAgreementsStore.getState().isLoading).toBe(false);
    });
  });

  describe('clearAgreements', () => {
    it('should reset state to initial', () => {
      useAgreementsStore.getState().setAgreements(mockAgreementListResponse.results);
      useAgreementsStore.getState().clearAgreements();
      expect(useAgreementsStore.getState().agreements).toHaveLength(0);
      expect(useAgreementsStore.getState().selectedAgreement).toBeNull();
      expect(useAgreementsStore.getState().error).toBeNull();
    });
  });

  describe('setSubscriptionLimits', () => {
    it('should set subscription limits', () => {
      const limits = { max_agreements: 10, current_agreements: 1 } as any;
      useAgreementsStore.getState().setSubscriptionLimits(limits);
      expect(useAgreementsStore.getState().subscriptionLimits).toEqual(limits);
    });
  });

  describe('setFeatureAccess', () => {
    it('should set feature access', () => {
      const access = { can_create: true, can_edit: true } as any;
      useAgreementsStore.getState().setFeatureAccess(access);
      expect(useAgreementsStore.getState().featureAccess).toEqual(access);
    });
  });
});
