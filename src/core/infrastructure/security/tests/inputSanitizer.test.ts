import { InputSanitizer } from '../validation/inputSanitizer';
import { SECURITY_CONSTANTS } from '../constants';

describe('InputSanitizer', () => {
  describe('sanitizeText', () => {
    it('should trim whitespace', () => {
      expect(InputSanitizer.sanitizeText('  hello  ')).toBe('hello');
    });

    it('should return null for empty string', () => {
      expect(InputSanitizer.sanitizeText('')).toBe(null);
    });

    it('should truncate long strings', () => {
      const long = 'a'.repeat(20000);
      const result = InputSanitizer.sanitizeText(long, 100);
      expect(result?.length).toBeLessThanOrEqual(100);
    });

    it('should remove HTML-like patterns', () => {
      const result = InputSanitizer.sanitizeText('<script>alert(1)</script>');
      expect(result).not.toContain('<script>');
    });
  });

  describe('sanitizeNumber', () => {
    it('should parse valid numbers', () => {
      expect(InputSanitizer.sanitizeNumber('42')).toBe(42);
      expect(InputSanitizer.sanitizeNumber(42)).toBe(42);
    });

    it('should return null for NaN', () => {
      expect(InputSanitizer.sanitizeNumber('abc')).toBe(null);
    });

    it('should enforce min/max bounds', () => {
      expect(InputSanitizer.sanitizeNumber('5', 10, 20)).toBe(null);
      expect(InputSanitizer.sanitizeNumber('25', 10, 20)).toBe(null);
      expect(InputSanitizer.sanitizeNumber('15', 10, 20)).toBe(15);
    });
  });

  describe('sanitizeEmail', () => {
    it('should validate and lowercase emails', () => {
      expect(InputSanitizer.sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(InputSanitizer.sanitizeEmail('not-an-email')).toBe(null);
    });

    it('should reject null/undefined', () => {
      expect(InputSanitizer.sanitizeEmail(null)).toBe(null);
      expect(InputSanitizer.sanitizeEmail(undefined)).toBe(null);
    });
  });

  describe('sanitizePhone', () => {
    it('should extract digits', () => {
      expect(InputSanitizer.sanitizePhone('+91-98765-43210')).toBe('919876543210');
    });

    it('should reject too short numbers', () => {
      expect(InputSanitizer.sanitizePhone('12345')).toBe(null);
    });

    it('should reject too long numbers', () => {
      expect(InputSanitizer.sanitizePhone('1'.repeat(20))).toBe(null);
    });
  });

  describe('validateFileType', () => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as string[];
    const allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'] as string[];

    it('should allow valid types', () => {
      expect(InputSanitizer.validateFileType('image/jpeg', allowedImageTypes)).toBe(true);
      expect(InputSanitizer.validateFileType('image/png', allowedImageTypes)).toBe(true);
    });

    it('should reject invalid types', () => {
      expect(InputSanitizer.validateFileType('application/x-msdownload', allowedImageTypes)).toBe(false);
    });

    it('should reject null types', () => {
      expect(InputSanitizer.validateFileType(null, allowedImageTypes)).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept valid sizes', () => {
      expect(InputSanitizer.validateFileSize(1024, 10 * 1024 * 1024)).toBe(true);
    });

    it('should reject oversized files', () => {
      expect(InputSanitizer.validateFileSize(20 * 1024 * 1024, 10 * 1024 * 1024)).toBe(false);
    });

    it('should reject zero/negative sizes', () => {
      expect(InputSanitizer.validateFileSize(0)).toBe(false);
      expect(InputSanitizer.validateFileSize(-1)).toBe(false);
    });
  });

  describe('validateFileName', () => {
    it('should accept valid names', () => {
      expect(InputSanitizer.validateFileName('document.pdf')).toBe(true);
      expect(InputSanitizer.validateFileName('my_file_123.jpg')).toBe(true);
    });

    it('should reject path traversal', () => {
      expect(InputSanitizer.validateFileName('../../etc/passwd')).toBe(false);
    });

    it('should reject too long names', () => {
      expect(InputSanitizer.validateFileName('a'.repeat(300))).toBe(false);
    });
  });

  describe('sanitizeFileName', () => {
    it('should sanitize special characters', () => {
      expect(InputSanitizer.sanitizeFileName('my file?.pdf')).toBe('my_file_.pdf');
    });

    it('should extract basename from paths', () => {
      expect(InputSanitizer.sanitizeFileName('/path/to/file.pdf')).toBe('file.pdf');
    });

    it('should return null for empty', () => {
      expect(InputSanitizer.sanitizeFileName('')).toBe(null);
    });
  });

  describe('validateSearchQuery', () => {
    it('should accept valid queries', () => {
      expect(InputSanitizer.validateSearchQuery('apartment')).toBe('apartment');
    });

    it('should reject XSS patterns', () => {
      expect(InputSanitizer.validateSearchQuery('<script>alert(1)</script>')).toBe(null);
      expect(InputSanitizer.validateSearchQuery('javascript:alert(1)')).toBe(null);
    });

    it('should truncate long queries', () => {
      const result = InputSanitizer.validateSearchQuery('a'.repeat(600));
      expect(result?.length).toBeLessThanOrEqual(500);
    });
  });
});
