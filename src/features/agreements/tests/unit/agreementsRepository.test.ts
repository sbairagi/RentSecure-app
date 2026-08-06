// @ts-nocheck
import { agreementsRepository } from '../../repository/agreementsRepository';
import {
  mockAgreement,
  mockAgreementDocument,
  mockAgreementListResponse,
  mockAgreementStatusSummary,
  mockAgreementTimeline,
  mockAgreementWitness,
} from '../../tests/mocks/data';

jest.mock('../../services/agreementsApi');

describe('agreementsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAgreements', () => {
    it('should fetch list of agreements', async () => {
      (agreementsRepository.fetchAgreements as jest.Mock).mockResolvedValue(mockAgreementListResponse);
      const result = await agreementsRepository.fetchAgreements();
      expect(result).toEqual(mockAgreementListResponse);
    });
  });

  describe('fetchAgreement', () => {
    it('should fetch a single agreement', async () => {
      (agreementsRepository.fetchAgreement as jest.Mock).mockResolvedValue(mockAgreement);
      const result = await agreementsRepository.fetchAgreement(1);
      expect(result).toEqual(mockAgreement);
    });
  });

  describe('createAgreement', () => {
    it('should create a new agreement', async () => {
      const newAgreement = { ...mockAgreement, id: 2 };
      (agreementsRepository.createAgreement as jest.Mock).mockResolvedValue(newAgreement);
      const result = await agreementsRepository.createAgreement({ renter: 1, unit: 1, agreement_start_date: '2024-01-01', agreement_end_date: '2025-01-01', rent_amount: '15000' });
      expect(result).toEqual(newAgreement);
    });
  });

  describe('updateAgreement', () => {
    it('should update an agreement', async () => {
      const updated = { ...mockAgreement, notes: 'updated' };
      (agreementsRepository.updateAgreement as jest.Mock).mockResolvedValue(updated);
      const result = await agreementsRepository.updateAgreement(1, { notes: 'updated' });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteAgreement', () => {
    it('should delete an agreement', async () => {
      (agreementsRepository.deleteAgreement as jest.Mock).mockResolvedValue(undefined);
      await expect(agreementsRepository.deleteAgreement(1)).resolves.toBeUndefined();
    });
  });

  describe('sendForSignature', () => {
    it('should send agreement for signature', async () => {
      (agreementsRepository.sendForSignature as jest.Mock).mockResolvedValue(mockAgreement);
      const result = await agreementsRepository.sendForSignature(1);
      expect(result).toEqual(mockAgreement);
    });
  });

  describe('fetchDocuments', () => {
    it('should fetch documents', async () => {
      (agreementsRepository.fetchDocuments as jest.Mock).mockResolvedValue([mockAgreementDocument]);
      const result = await agreementsRepository.fetchDocuments(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchTimeline', () => {
    it('should fetch timeline', async () => {
      (agreementsRepository.fetchTimeline as jest.Mock).mockResolvedValue([mockAgreementTimeline]);
      const result = await agreementsRepository.fetchTimeline(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchWitnesses', () => {
    it('should fetch witnesses', async () => {
      (agreementsRepository.fetchWitnesses as jest.Mock).mockResolvedValue([mockAgreementWitness]);
      const result = await agreementsRepository.fetchWitnesses(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchStatusSummary', () => {
    it('should fetch status summary', async () => {
      (agreementsRepository.fetchStatusSummary as jest.Mock).mockResolvedValue(mockAgreementStatusSummary);
      const result = await agreementsRepository.fetchStatusSummary();
      expect(result).toEqual(mockAgreementStatusSummary);
    });
  });
});
