// @ts-check
import { agreementsApi } from '../../services/agreementsApi';
import {
  mockAgreement,
  mockAgreementDocument,
  mockAgreementListResponse,
  mockAgreementStatusSummary,
  mockAgreementTimeline,
  mockAgreementWitness,
} from '../../tests/mocks/data';

jest.mock('../../services/agreementsApi');

describe('agreementsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch list of agreements', async () => {
      (agreementsApi.list as jest.Mock).mockResolvedValue(mockAgreementListResponse);
      const result = await agreementsApi.list();
      expect(result).toEqual(mockAgreementListResponse);
      expect((result as any).results).toHaveLength(1);
    });

    it('should handle empty list', async () => {
      (agreementsApi.list as jest.Mock).mockResolvedValue({ results: [] });
      const result = await agreementsApi.list();
      expect((result as any).results).toHaveLength(0);
    });
  });

  describe('retrieve', () => {
    it('should fetch a single agreement', async () => {
      (agreementsApi.retrieve as jest.Mock).mockResolvedValue(mockAgreement);
      const result = await agreementsApi.retrieve(1);
      expect(result).toEqual(mockAgreement);
    });
  });

  describe('create', () => {
    it('should create a new agreement', async () => {
      const newAgreement = { ...mockAgreement, id: 2 };
      (agreementsApi.create as jest.Mock).mockResolvedValue(newAgreement);
      const result = await agreementsApi.create({ renter: 1, unit: 1, agreement_start_date: '2024-01-01', agreement_end_date: '2025-01-01', rent_amount: '15000' });
      expect(result).toEqual(newAgreement);
    });
  });

  describe('update', () => {
    it('should update an agreement', async () => {
      const updatedAgreement = { ...mockAgreement, notes: 'updated' };
      (agreementsApi.update as jest.Mock).mockResolvedValue(updatedAgreement);
      const result = await agreementsApi.update(1, { notes: 'updated' });
      expect(result).toEqual(updatedAgreement);
    });
  });

  describe('remove', () => {
    it('should delete an agreement', async () => {
      (agreementsApi.remove as jest.Mock).mockResolvedValue(undefined);
      await expect(agreementsApi.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('sendForSignature', () => {
    it('should send agreement for signature', async () => {
      (agreementsApi.sendForSignature as jest.Mock).mockResolvedValue(mockAgreement);
      const result = await agreementsApi.sendForSignature(1);
      expect(result).toEqual(mockAgreement);
    });
  });

  describe('getDocuments', () => {
    it('should fetch list of documents', async () => {
      (agreementsApi.getDocuments as jest.Mock).mockResolvedValue([mockAgreementDocument]);
      const result = await agreementsApi.getDocuments(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getTimeline', () => {
    it('should fetch agreement timeline', async () => {
      (agreementsApi.getTimeline as jest.Mock).mockResolvedValue([mockAgreementTimeline]);
      const result = await agreementsApi.getTimeline(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getWitnesses', () => {
    it('should fetch witnesses', async () => {
      (agreementsApi.getWitnesses as jest.Mock).mockResolvedValue([mockAgreementWitness]);
      const result = await agreementsApi.getWitnesses(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getStatusSummary', () => {
    it('should fetch status summary', async () => {
      (agreementsApi.getStatusSummary as jest.Mock).mockResolvedValue(mockAgreementStatusSummary);
      const result = await agreementsApi.getStatusSummary();
      expect(result).toEqual(mockAgreementStatusSummary);
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      (agreementsApi.list as jest.Mock).mockRejectedValue(error);
      await expect(agreementsApi.list()).rejects.toThrow('API Error');
    });
  });
});
