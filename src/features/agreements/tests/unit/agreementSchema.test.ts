// @ts-nocheck
import { z } from 'zod';
import { agreementCreateSchema, agreementUpdateSchema, agreementFilterSchema } from '../../validations/agreementSchema';

describe('agreementSchema', () => {
  describe('agreementCreateSchema', () => {
    it('should validate valid agreement data', () => {
      const data = {
        renter: 1,
        unit: 1,
        agreement_start_date: '2024-01-01',
        agreement_end_date: '2025-01-01',
        rent_amount: '15000',
        security_deposit: '30000',
        notes: 'Test notes',
        witness_name: 'Amit Kumar',
        witness_phone: '+919876543210',
        witness_address: '123 Main St',
      };
      const result = agreementCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid rent amount', () => {
      const data = {
        renter: 1,
        unit: 1,
        agreement_start_date: '2024-01-01',
        agreement_end_date: '2025-01-01',
        rent_amount: '-100',
      };
      const result = agreementCreateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const result = agreementCreateSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone number', () => {
      const data = {
        renter: 1,
        unit: 1,
        agreement_start_date: '2024-01-01',
        agreement_end_date: '2025-01-01',
        rent_amount: '15000',
        witness_phone: 'invalid',
      };
      const result = agreementCreateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('agreementUpdateSchema', () => {
    it('should validate partial update', () => {
      const result = agreementUpdateSchema.safeParse({ notes: 'updated' });
      expect(result.success).toBe(true);
    });

    it('should accept boolean flags', () => {
      const result = agreementUpdateSchema.safeParse({
        owner_signed: true,
        renter_signed: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('agreementFilterSchema', () => {
    it('should validate empty filters', () => {
      const result = agreementFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate filter with search', () => {
      const result = agreementFilterSchema.safeParse({ search: 'test' });
      expect(result.success).toBe(true);
    });

    it('should validate filter with status', () => {
      const result = agreementFilterSchema.safeParse({ status: 'active' });
      expect(result.success).toBe(true);
    });
  });
});
