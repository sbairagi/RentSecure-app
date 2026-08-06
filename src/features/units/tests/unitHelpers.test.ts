// @ts-nocheck
import type { Unit } from '../types/units';
import {
  filterUnits,
  formatCurrency,
  formatDate,
  formatStatus,
  formatUnitType,
  generateCSV,
  isUnitVacant,
  sortUnits,
} from '../utils/unitHelpers';

const mockUnit: Unit = {
  id: 1,
  owner: 1,
  building: 1,
  unit: '101',
  building_name: 'Sunshine Complex',
  unit_type: 'flat',
  address_line: '123 Main St',
  landmark: 'Near Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  postal_code: '400001',
  latitude: '19.0760',
  longitude: '72.8777',
  status: 'occupied',
  is_vacant: false,
  is_verified: true,
  is_archived: false,
  last_vacated_at: null,
  rent_due_reminder: true,
  agreement_expiry_reminder: true,
  maintenance_notes: '',
  notes: '',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('unitHelpers', () => {
  describe('formatUnitType', () => {
    it('should format flat unit type', () => {
      expect(formatUnitType('flat')).toBe('Flat/Apartment');
    });

    it('should format villa unit type', () => {
      expect(formatUnitType('villa')).toBe('Villa');
    });

    it('should return original for unknown type', () => {
      expect(formatUnitType('unknown')).toBe('unknown');
    });
  });

  describe('formatStatus', () => {
    it('should format vacant status', () => {
      expect(formatStatus('vacant')).toBe('Vacant');
    });

    it('should format occupied status', () => {
      expect(formatStatus('occupied')).toBe('Occupied');
    });
  });

  describe('formatCurrency', () => {
    it('should format number as INR currency', () => {
      const result = formatCurrency(15000);
      expect(result).toContain('15');
    });

    it('should handle string input', () => {
      const result = formatCurrency('25000');
      expect(result).toContain('25');
    });

    it('should handle invalid input', () => {
      const result = formatCurrency(NaN);
      expect(result).toBe('₹0');
    });
  });

  describe('formatDate', () => {
    it('should format valid date', () => {
      const result = formatDate('2024-01-15T00:00:00Z');
      expect(result).not.toBe('N/A');
    });

    it('should return N/A for null', () => {
      expect(formatDate(null)).toBe('N/A');
    });

    it('should return N/A for undefined', () => {
      expect(formatDate(undefined)).toBe('N/A');
    });
  });

  describe('isUnitVacant', () => {
    it('should return true for vacant unit', () => {
      const vacantUnit = { ...mockUnit, status: 'vacant', is_vacant: true };
      expect(isUnitVacant(vacantUnit)).toBe(true);
    });

    it('should return false for occupied unit', () => {
      expect(isUnitVacant(mockUnit)).toBe(false);
    });
  });

  describe('filterUnits', () => {
    it('should filter by search term', () => {
      const units = [mockUnit];
      const filtered = filterUnits(units, { search: '101' });
      expect(filtered).toHaveLength(1);
    });

    it('should filter by building', () => {
      const units = [mockUnit];
      const filtered = filterUnits(units, { building: 1 });
      expect(filtered).toHaveLength(1);
    });

    it('should filter by status', () => {
      const units = [mockUnit];
      const filtered = filterUnits(units, { status: 'occupied' });
      expect(filtered).toHaveLength(1);
    });

    it('should return empty array when no matches', () => {
      const units = [mockUnit];
      const filtered = filterUnits(units, { search: 'nonexistent' });
      expect(filtered).toHaveLength(0);
    });
  });

  describe('sortUnits', () => {
    it('should sort by newest', () => {
      const units = [
        { ...mockUnit, id: 1, created_at: '2024-01-01T00:00:00Z' },
        { ...mockUnit, id: 2, created_at: '2024-02-01T00:00:00Z' },
      ];
      const sorted = sortUnits(units, 'newest');
      expect(sorted[0].id).toBe(2);
    });

    it('should sort by oldest', () => {
      const units = [
        { ...mockUnit, id: 1, created_at: '2024-01-01T00:00:00Z' },
        { ...mockUnit, id: 2, created_at: '2024-02-01T00:00:00Z' },
      ];
      const sorted = sortUnits(units, 'oldest');
      expect(sorted[0].id).toBe(1);
    });

    it('should sort alphabetically', () => {
      const units = [
        { ...mockUnit, id: 1, unit: 'B' },
        { ...mockUnit, id: 2, unit: 'A' },
      ];
      const sorted = sortUnits(units, 'alphabetical');
      expect(sorted[0].unit).toBe('A');
    });
  });

  describe('generateCSV', () => {
    it('should generate valid CSV', () => {
      const csv = generateCSV([mockUnit]);
      expect(csv).toContain('101');
      expect(csv).toContain('Flat/Apartment');
      expect(csv).toContain('Occupied');
    });
  });
});
