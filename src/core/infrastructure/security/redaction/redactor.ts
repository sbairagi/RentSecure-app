import type { SensitiveFieldRedactionResult, DeepLinkValidationResult } from '../types';
import { SECURITY_CONSTANTS } from '../constants';

export class Redactor {
  static redactObject(
    obj: Record<string, any>,
    extraSensitiveFields: string[] = []
  ): SensitiveFieldRedactionResult {
    const sensitiveFields = [...SECURITY_CONSTANTS.SENSITIVE_FIELDS, ...extraSensitiveFields];
    const redacted: Record<string, any> = { ...obj };
    const fieldsRedacted: string[] = [];

    for (const key of Object.keys(redacted)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.some((f) => lowerKey.includes(f.toLowerCase()))) {
        redacted[key] = '[REDACTED]';
        fieldsRedacted.push(key);
      } else if (typeof redacted[key] === 'object' && redacted[key] !== null && !Array.isArray(redacted[key])) {
        const nested = this.redactObject(redacted[key], extraSensitiveFields);
        if (nested.fieldsRedacted.length > 0) {
          redacted[key] = nested.redacted;
          fieldsRedacted.push(...nested.fieldsRedacted.map((f) => `${key}.${f}`));
        }
      }
    }

    return { redacted, fieldsRedacted };
  }

  static redactHeaders(headers: Record<string, string> | undefined): Record<string, string> {
    if (!headers) return {};
    const sanitized: Record<string, string> = { ...headers };
    for (const header of SECURITY_CONSTANTS.SENSITIVE_HEADERS) {
      const key = Object.keys(sanitized).find(
        (k) => k.toLowerCase() === header.toLowerCase()
      );
      if (key) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  static redactString(value: string, extraPatterns: RegExp[] = []): string {
    const patterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /\b\d{10,}\b/g,
      /\b[A-Za-z0-9]{20,}\b/g,
      /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,
      /eyJ[A-Za-z0-9\-._~+/]+=*/g,
      ...extraPatterns,
    ];

    let redacted = value;
    for (const pattern of patterns) {
      redacted = redacted.replace(pattern, '[REDACTED]');
    }
    return redacted;
  }

  static redactDeepLinkPayload(payload: Record<string, any>): DeepLinkValidationResult {
    const sanitized = { ...payload };

    if (sanitized.token) {
      sanitized.token = '[REDACTED_TOKEN]';
    }
    if (sanitized.id && /^\d+$/.test(sanitized.id)) {
      sanitized.id = '[REDACTED_ID]';
    }

    return {
      isValid: true,
      sanitizedPayload: sanitized,
    };
  }

  static redactApiResponse(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.redactApiResponse(item));
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('token') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('otp') ||
        lowerKey.includes('cvv') ||
        lowerKey.includes('bank_account') ||
        lowerKey.includes('ifsc') ||
        lowerKey.includes('razorpay') ||
        lowerKey.includes('cashfree')
      ) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.redactApiResponse(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
