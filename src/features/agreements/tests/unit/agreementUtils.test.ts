// @ts-nocheck
import {
  deriveAgreementStatus,
  filterAgreements,
  formatAgreementStatus,
  formatCurrency,
  formatDate,
  generateCSV,
  getAgreementStatusColor,
  getAgreementStatusBackgroundColor,
  isAgreementActive,
  isAgreementExpired,
  isAgreementFullySigned,
  sortAgreements,
} from '../../utils/agreementUtils';
import { mockAgreement, mockAgreementList } from '../../tests/mocks/data';

describe('agreementUtils', () => {
  describe('deriveAgreementStatus', () => {
    it('should return draft for unsigned agreement', () => {
      const agreement = { ...mockAgreement, owner_signed: false, renter_signed: false, leegality_document_id: null };
      expect(deriveAgreementStatus(agreement)).toBe('draft');
    });

    it('should return pending_signature when sent for signature', () => {
      const agreement = { ...mockAgreement, owner_signed: false, renter_signed: false, leegality_document_id: 'doc123' };
      expect(deriveAgreementStatus(agreement)).toBe('pending_signature');
    });

    it('should return partially_signed when one party signed', () => {
      const agreement = { ...mockAgreement, owner_signed: true, renter_signed: false };
      expect(deriveAgreementStatus(agreement)).toBe('partially_signed');
    });

    it('should return active when fully signed and within dates', () => {
      const agreement = {
        ...mockAgreement,
        owner_signed: true,
        renter_signed: true,
        agreement_start_date: '2024-01-01',
        agreement_end_date: '2099-01-01',
      };
      expect(deriveAgreementStatus(agreement)).toBe('active');
    });

    it('should return expired when end date passed', () => {
      const agreement = {
        ...mockAgreement,
        owner_signed: true,
        renter_signed: true,
        agreement_start_date: '2020-01-01',
        agreement_end_date: '2021-01-01',
      };
      expect(deriveAgreementStatus(agreement)).toBe('expired');
    });

    it('should return terminated when revoked', () => {
      const agreement = { ...mockAgreement, is_agreement_revoked: true };
      expect(deriveAgreementStatus(agreement)).toBe('terminated');
    });
  });

  describe('isAgreementFullySigned', () => {
    it('should return true when both signed', () => {
      expect(isAgreementFullySigned({ ...mockAgreement, owner_signed: true, renter_signed: true })).toBe(true);
    });

    it('should return false when only one signed', () => {
      expect(isAgreementFullySigned({ ...mockAgreement, owner_signed: true, renter_signed: false })).toBe(false);
    });
  });

  describe('isAgreementActive', () => {
    it('should return true for active agreement', () => {
      const agreement = {
        ...mockAgreement,
        owner_signed: true,
        renter_signed: true,
        agreement_end_date: '2099-01-01',
      };
      expect(isAgreementActive(agreement)).toBe(true);
    });

    it('should return false for expired agreement', () => {
      const agreement = {
        ...mockAgreement,
        owner_signed: true,
        renter_signed: true,
        agreement_end_date: '2020-01-01',
      };
      expect(isAgreementActive(agreement)).toBe(false);
    });
  });

  describe('filterAgreements', () => {
    it('should filter by status', () => {
      const result = filterAgreements(mockAgreementList, { status: 'draft' });
      expect(result).toHaveLength(1);
    });

    it('should filter by search', () => {
      const result = filterAgreements(mockAgreementList, { search: 'Rahul' });
      expect(result).toHaveLength(1);
    });

    it('should return all when no filters', () => {
      const result = filterAgreements(mockAgreementList, {});
      expect(result).toHaveLength(1);
    });
  });

  describe('sortAgreements', () => {
    it('should sort by newest', () => {
      const agreements = [mockAgreement, { ...mockAgreement, id: 2, created_at: '2025-01-01T00:00:00Z' }];
      const result = sortAgreements(agreements, 'newest');
      expect(result[0].id).toBe(2);
    });

    it('should sort by oldest', () => {
      const agreements = [mockAgreement, { ...mockAgreement, id: 2, created_at: '2025-01-01T00:00:00Z' }];
      const result = sortAgreements(agreements, 'oldest');
      expect(result[0].id).toBe(1);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(15000)).toContain('15,000');
    });

    it('should handle string input', () => {
      expect(formatCurrency('15000')).toContain('15,000');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      expect(formatDate('2024-01-01')).not.toBe('N/A');
    });

    it('should return N/A for null', () => {
      expect(formatDate(null)).toBe('N/A');
    });
  });

  describe('generateCSV', () => {
    it('should generate CSV with headers', () => {
      const csv = generateCSV(mockAgreementList);
      expect(csv).toContain('ID');
      expect(csv).toContain('Renter');
      expect(csv).toContain('Status');
    });
  });

  describe('getAgreementStatusColor', () => {
    it('should return correct color for active', () => {
      expect(getAgreementStatusColor('active')).toBe('#16a34a');
    });

    it('should return default color for unknown status', () => {
      expect(getAgreementStatusColor('unknown')).toBe('#374151');
    });
  });

  describe('getAgreementStatusBackgroundColor', () => {
    it('should return correct background color for draft', () => {
      expect(getAgreementStatusBackgroundColor('draft')).toBe('#f3f4f6');
    });
  });
});
