// @ts-nocheck
import {
  formatCurrency,
  formatDate,
  formatRentAmount,
  getRenterFullAddress,
  getRenterStatusBackgroundColor,
  getRenterStatusColor,
  getRenterUnitInfo,
  isRenterActive,
  isRenterArchived,
  isRenterOnNotice,
  validatePhone,
} from '../utils/renterUtils';

const mockRenter = {
  id: 1,
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+919876543210',
  status: 'active',
  is_archived: false,
  rent_amount: '15000',
  start_date: '2024-01-01',
  end_date: null,
  unit_name: 'A-101',
  building_name: 'Sunshine Complex',
  address_line: '123 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  postal_code: '400001',
};

describe('renterUtils', () => {
  describe('formatCurrency', () => {
    it('should format number as INR currency', () => {
      const result = formatCurrency(15000);
      expect(result).toContain('15');
      expect(result).toContain('000');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toBe('₹0');
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

  describe('formatRentAmount', () => {
    it('should format rent amount as INR currency', () => {
      const result = formatRentAmount('15000');
      expect(result).toContain('15');
    });

    it('should handle numeric input', () => {
      const result = formatRentAmount(25000);
      expect(result).toContain('25');
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

  describe('getRenterStatusColor', () => {
    it('should return green for active', () => {
      expect(getRenterStatusColor('active')).toBe('#16a34a');
    });

    it('should return orange for notice_period', () => {
      expect(getRenterStatusColor('notice_period')).toBe('#d97706');
    });

    it('should return red for revoked', () => {
      expect(getRenterStatusColor('revoked')).toBe('#dc2626');
    });

    it('should return gray for deactivated', () => {
      expect(getRenterStatusColor('deactivated')).toBe('#6b7280');
    });

    it('should return default for unknown', () => {
      expect(getRenterStatusColor('unknown')).toBe('#374151');
    });
  });

  describe('getRenterStatusBackgroundColor', () => {
    it('should return light green for active', () => {
      expect(getRenterStatusBackgroundColor('active')).toBe('#dcfce7');
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone number', () => {
      expect(validatePhone('+919876543210')).toBe(true);
    });

    it('should reject invalid phone number', () => {
      expect(validatePhone('123')).toBe(false);
    });
  });

  describe('isRenterActive', () => {
    it('should return true for active renter', () => {
      expect(isRenterActive(mockRenter)).toBe(true);
    });

    it('should return false for notice_period renter', () => {
      const renter = { ...mockRenter, status: 'notice_period' };
      expect(isRenterActive(renter)).toBe(false);
    });
  });

  describe('isRenterOnNotice', () => {
    it('should return true for notice_period renter', () => {
      const renter = { ...mockRenter, status: 'notice_period' };
      expect(isRenterOnNotice(renter)).toBe(true);
    });

    it('should return false for active renter', () => {
      expect(isRenterOnNotice(mockRenter)).toBe(false);
    });
  });

  describe('isRenterArchived', () => {
    it('should return true for archived renter', () => {
      const renter = { ...mockRenter, is_archived: true };
      expect(isRenterArchived(renter)).toBe(true);
    });

    it('should return false for non-archived renter', () => {
      expect(isRenterArchived(mockRenter)).toBe(false);
    });
  });

  describe('getRenterFullAddress', () => {
    it('should return full address string', () => {
      const address = getRenterFullAddress(mockRenter);
      expect(address).toContain('Mumbai');
      expect(address).toContain('Maharashtra');
    });

    it('should handle missing address parts', () => {
      const renter = {
        ...mockRenter,
        address_line: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
      };
      const address = getRenterFullAddress(renter);
      expect(address).toBe('N/A');
    });
  });

  describe('getRenterUnitInfo', () => {
    it('should return unit info string', () => {
      const info = getRenterUnitInfo(mockRenter);
      expect(info).toContain('A-101');
      expect(info).toContain('Sunshine Complex');
    });

    it('should return null for renter without unit', () => {
      const renter = { ...mockRenter, unit_name: null, building_name: null };
      const info = getRenterUnitInfo(renter);
      expect(info).toBeNull();
    });
  });
});
