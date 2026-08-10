import { SECURITY_CONSTANTS } from '../constants';
import type { FileValidationResult } from '../types';

export class InputSanitizer {
  static sanitizeText(input: string | undefined | null, maxLength = 10000): string | null {
    if (!input) return null;
    if (typeof input !== 'string') return null;

    let sanitized = input.trim();
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    sanitized = sanitized
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');

    return sanitized;
  }

  static sanitizeNumber(
    input: unknown,
    min?: number,
    max?: number
  ): number | null {
    if (input === null || input === undefined) return null;
    const num = typeof input === 'number' ? input : parseFloat(String(input));
    if (isNaN(num)) return null;
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;
    return num;
  }

  static sanitizeEmail(email: string | undefined | null): string | null {
    if (!email || typeof email !== 'string') return null;
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) return null;
    if (sanitized.length > 254) return null;
    return sanitized;
  }

  static sanitizePhone(phone: string | undefined | null): string | null {
    if (!phone || typeof phone !== 'string') return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return null;
    return digits;
  }

  static sanitizeUrl(url: string | undefined | null): string | null {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (trimmed.length > 2048) return null;
    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:', 'rentsecure:'].includes(parsed.protocol)) {
        return null;
      }
      return trimmed;
    } catch {
      return null;
    }
  }

  static validateFileType(
    fileType: string | undefined | null,
    allowedTypes: string[]
  ): boolean {
    if (!fileType) return false;
    return allowedTypes.some((type) => fileType.toLowerCase().includes(type.toLowerCase()));
  }

  static validateFileSize(
    sizeBytes: number | undefined | null,
    maxBytes: number = SECURITY_CONSTANTS.MAX_FILE_SIZE_BYTES
  ): boolean {
    if (sizeBytes === null || sizeBytes === undefined) return false;
    return sizeBytes > 0 && sizeBytes <= maxBytes;
  }

  static validateFileName(fileName: string | undefined | null): boolean {
    if (!fileName) return false;
    if (fileName.length > 255) return false;
    const dangerousPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /\x00/,
      /[\x01-\x1f\x7f]/,
    ];
    return !dangerousPatterns.some((pattern) => pattern.test(fileName));
  }

  static sanitizeFileName(fileName: string | undefined | null): string | null {
    if (!fileName) return null;
    const baseName = fileName.split('/').pop()?.split('\\').pop() || fileName;
    const sanitized = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (sanitized.length > 255) return null;
    return sanitized;
  }

  static validateSearchQuery(query: string | undefined | null): string | null {
    if (!query) return null;
    const sanitized = query.trim();
    if (sanitized.length === 0) return null;
    if (sanitized.length > 500) return null;
    const dangerous = ['<script', 'javascript:', 'onerror=', 'onload='];
    const lower = sanitized.toLowerCase();
    if (dangerous.some((pattern) => lower.includes(pattern))) {
      return null;
    }
    return sanitized;
  }

  static validateAiPrompt(prompt: string | undefined | null): string | null {
    if (!prompt) return null;
    const sanitized = prompt.trim();
    if (sanitized.length === 0) return null;
    if (sanitized.length > 10000) return null;
    return sanitized;
  }
}
