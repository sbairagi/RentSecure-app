// @ts-nocheck
import {
  mockRenter,
  mockRenterDocument,
  mockRenterKYC,
  mockRenterListResponse,
  mockRenterProfile,
  mockRenterStatusSummary,
} from '../../tests/mocks/data';
import { rentersRepository } from '../repository/rentersRepository';

jest.mock('../../services/rentersApi');

describe('rentersRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRenters', () => {
    it('should fetch list of renters via API', async () => {
      const result = await rentersRepository.fetchRenters();
      expect(result).toEqual(mockRenterListResponse);
    });

    it('should pass params to API', async () => {
      await rentersRepository.fetchRenters({ search: 'Rahul', page: 1 });
      expect(rentersRepository.fetchRenters).toHaveBeenCalled();
    });
  });

  describe('fetchRenter', () => {
    it('should fetch a single renter', async () => {
      const result = await rentersRepository.fetchRenter(1);
      expect(result).toEqual(mockRenter);
    });
  });

  describe('createRenter', () => {
    it('should create a new renter', async () => {
      const result = await rentersRepository.createRenter({} as any);
      expect(result).toEqual(mockRenter);
    });
  });

  describe('updateRenter', () => {
    it('should update a renter', async () => {
      const result = await rentersRepository.updateRenter(1, {} as any);
      expect(result).toEqual(mockRenter);
    });
  });

  describe('deleteRenter', () => {
    it('should delete a renter', async () => {
      await expect(rentersRepository.deleteRenter(1)).resolves.toBeUndefined();
    });
  });

  describe('fetchKycDocuments', () => {
    it('should fetch KYC details', async () => {
      const result = await rentersRepository.fetchKycDocuments(1);
      expect(result).toEqual([mockRenterKYC]);
    });
  });

  describe('fetchDocuments', () => {
    it('should fetch documents', async () => {
      const result = await rentersRepository.fetchDocuments(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('createKycDocument', () => {
    it('should upload document', async () => {
      const result = await rentersRepository.createKycDocument(1, new FormData());
      expect(result).toEqual(mockRenterDocument);
    });
  });

  describe('fetchRentRecords', () => {
    it('should fetch payments', async () => {
      const result = await rentersRepository.fetchRentRecords(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchAgreements', () => {
    it('should fetch agreements', async () => {
      const result = await rentersRepository.fetchAgreements(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchTimeline', () => {
    it('should fetch timeline', async () => {
      const result = await rentersRepository.fetchTimeline(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchRecentActivity', () => {
    it('should fetch activity', async () => {
      const result = await rentersRepository.fetchRecentActivity();
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchBootstrapData', () => {
    it('should fetch profile via bootstrap', async () => {
      const result = await rentersRepository.fetchBootstrapData();
      expect(result).toEqual(mockRenterProfile);
    });
  });

  describe('fetchStatusSummary', () => {
    it('should fetch status summary', async () => {
      const result = await rentersRepository.fetchStatusSummary();
      expect(result).toEqual(mockRenterStatusSummary);
    });
  });
});
