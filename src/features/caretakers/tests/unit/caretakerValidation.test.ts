import { validateCaretaker } from '../../validations/caretakerValidation';

describe('caretakerValidation', () => {
  const validCaretaker = {
    unit: 1,
    name: 'Rahul Caretaker',
    phone: '+919876543210',
    email: 'rahul@example.com',
    alternate_phone: '+919876543211',
    address: '123 Main St',
    joining_date: '2024-01-01',
    notes: '',
  };

  it('should validate correct caretaker data', () => {
    const result = validateCaretaker(validCaretaker);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = validateCaretaker({ ...validCaretaker, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e: any) => e.path.includes('name'))).toBe(true);
    }
  });

  it('should reject invalid phone', () => {
    const result = validateCaretaker({ ...validCaretaker, phone: '123' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = validateCaretaker({ ...validCaretaker, email: 'invalid-email' });
    expect(result.success).toBe(false);
  });

  it('should accept empty email as optional', () => {
    const result = validateCaretaker({ ...validCaretaker, email: '' });
    expect(result.success).toBe(true);
  });

  it('should reject missing joining_date', () => {
    const result = validateCaretaker({ ...validCaretaker, joining_date: '' });
    expect(result.success).toBe(false);
  });

  it('should reject unit less than 1', () => {
    const result = validateCaretaker({ ...validCaretaker, unit: 0 });
    expect(result.success).toBe(false);
  });

  it('should accept alternate phone with correct format', () => {
    const result = validateCaretaker({ ...validCaretaker, alternate_phone: '+919876543211' });
    expect(result.success).toBe(true);
  });
});
