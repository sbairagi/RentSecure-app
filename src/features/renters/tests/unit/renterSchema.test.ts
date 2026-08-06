// @ts-nocheck
import { renterCreateSchema, renterUpdateSchema } from '../validations/renterSchema';

describe('renterSchema', () => {
  describe('renterCreateSchema', () => {
    it('should validate a valid renter creation payload', () => {
      const validPayload = {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+919876543210',
        emergency_contact_name: 'Priya Sharma',
        emergency_contact_number: '+919876543211',
        rent_amount: '15000',
        start_date: '2024-01-01',
        end_date: '2025-01-01',
        notes: '',
      };

      const result = renterCreateSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidPayload = {
        name: 'Rahul Sharma',
        email: 'invalid-email',
        phone: '+919876543210',
        rent_amount: '15000',
        start_date: '2024-01-01',
      };

      const result = renterCreateSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidPayload = {
        name: '',
        email: '',
        phone: '',
        rent_amount: '',
        start_date: '',
      };

      const result = renterCreateSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone', () => {
      const invalidPayload = {
        name: 'Rahul',
        phone: '123',
        rent_amount: '15000',
        start_date: '2024-01-01',
      };

      const result = renterCreateSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('renterUpdateSchema', () => {
    it('should validate a valid partial update', () => {
      const validUpdate = {
        email: 'newemail@example.com',
        rent_amount: '16000',
      };

      const result = renterUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate empty partial update', () => {
      const result = renterUpdateSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should reject invalid status in update', () => {
      const invalidUpdate = {
        status: 'invalid_status',
      };

      const result = renterUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
