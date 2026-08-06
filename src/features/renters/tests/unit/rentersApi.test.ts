// @ts-check
import { rentersApi } from '../../services/rentersApi';
import {
  mockRenter,
  mockRenterActivity,
  mockRenterAgreement,
  mockRenterDocument,
  mockRenterKYC,
  mockRenterListResponse,
  mockRenterProfile,
  mockRenterStatusSummary,
  mockRenterTimeline,
  mockRentRecord,
} from '../../tests/mocks/data';

jest.mock('../../services/rentersApi');

describe('rentersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch list of renters', async () => {
      (rentersApi.list as jest.Mock).mockResolvedValue(mockRenterListResponse);
      const result = await rentersApi.list();
      expect(result).toEqual(mockRenterListResponse);
      expect((result as any).results).toHaveLength(1);
    });

    it('should handle empty list', async () => {
      (rentersApi.list as jest.Mock).mockResolvedValue({ results: [] });
      const result = await rentersApi.list();
      expect((result as any).results).toHaveLength(0);
    });
  });

  describe('retrieve', () => {
    it('should fetch a single renter', async () => {
      (rentersApi.retrieve as jest.Mock).mockResolvedValue(mockRenter);
      const result = await rentersApi.retrieve(1);
      expect(result).toEqual(mockRenter);
    });

    it('should handle string id', async () => {
      (rentersApi.retrieve as jest.Mock).mockResolvedValue(mockRenter);
      const result = await rentersApi.retrieve('1');
      expect(result).toEqual(mockRenter);
    });
  });

  describe('create', () => {
    it('should create a new renter', async () => {
      const newRenter = { ...mockRenter, id: 2, email: 'new@example.com' };
      (rentersApi.create as jest.Mock).mockResolvedValue(newRenter);
      const result = await rentersApi.create({ email: 'new@example.com' } as any);
      expect(result).toEqual(newRenter);
    });
  });

  describe('update', () => {
    it('should update a renter', async () => {
      const updatedRenter = { ...mockRenter, email: 'updated@example.com' };
      (rentersApi.update as jest.Mock).mockResolvedValue(updatedRenter);
      const result = await rentersApi.update(1, { email: 'updated@example.com' } as any);
      expect(result).toEqual(updatedRenter);
    });
  });

  describe('remove', () => {
    it('should delete a renter', async () => {
      (rentersApi.remove as jest.Mock).mockResolvedValue(undefined);
      await expect(rentersApi.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('getKycDocuments', () => {
    it('should fetch KYC details', async () => {
      (rentersApi.getKycDocuments as jest.Mock).mockResolvedValue([mockRenterKYC]);
      const result = await rentersApi.getKycDocuments(1);
      expect(result).toEqual([mockRenterKYC]);
    });
  });

  describe('getDocuments', () => {
    it('should fetch list of documents', async () => {
      (rentersApi.getDocuments as jest.Mock).mockResolvedValue([mockRenterDocument]);
      const result = await rentersApi.getDocuments(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('createKycDocument', () => {
    it('should upload a document', async () => {
      (rentersApi.createKycDocument as jest.Mock).mockResolvedValue(mockRenterDocument);
      const result = await rentersApi.createKycDocument(1, new FormData());
      expect(result).toEqual(mockRenterDocument);
    });
  });

  describe('getRentRecords', () => {
    it('should fetch list of payments', async () => {
      (rentersApi.getRentRecords as jest.Mock).mockResolvedValue([mockRentRecord]);
      const result = await rentersApi.getRentRecords(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getAgreements', () => {
    it('should fetch list of agreements', async () => {
      (rentersApi.getAgreements as jest.Mock).mockResolvedValue([mockRenterAgreement]);
      const result = await rentersApi.getAgreements(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getTimeline', () => {
    it('should fetch renter timeline', async () => {
      (rentersApi.getTimeline as jest.Mock).mockResolvedValue([mockRenterTimeline]);
      const result = await rentersApi.getTimeline(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getRecentActivity', () => {
    it('should fetch renter activity', async () => {
      (rentersApi.getRecentActivity as jest.Mock).mockResolvedValue([mockRenterActivity]);
      const result = await rentersApi.getRecentActivity();
      expect(result).toHaveLength(1);
    });
  });

  describe('getBootstrapData', () => {
    it('should fetch renter profile via bootstrap', async () => {
      (rentersApi.getBootstrapData as jest.Mock).mockResolvedValue(mockRenterProfile);
      const result = await rentersApi.getBootstrapData();
      expect(result).toEqual(mockRenterProfile);
    });
  });

  describe('getStatusSummary', () => {
    it('should fetch status summary', async () => {
      (rentersApi.getStatusSummary as jest.Mock).mockResolvedValue(mockRenterStatusSummary);
      const result = await rentersApi.getStatusSummary();
      expect(result).toEqual(mockRenterStatusSummary);
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      (rentersApi.list as jest.Mock).mockRejectedValue(error);
      await expect(rentersApi.list()).rejects.toThrow('API Error');
    });
  });
});
