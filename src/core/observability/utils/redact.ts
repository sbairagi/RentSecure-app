const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'access',
  'refresh',
  'authorization',
  'otp',
  'cvv',
  'cvv2',
  'card_number',
  'cardNumber',
  'upi',
  'bank_account',
  'bankAccount',
  'ifsc',
  'routing_number',
  'account_number',
  'accountNumber',
  'pan',
  'aadhaar',
  'ssn',
  'document',
  'file',
  'base64',
  'private_key',
  'privateKey',
  'api_key',
  'apiKey',
  'webhook_secret',
  'webhookSecret',
  'razorpay_secret',
  'razorpaySecret',
  'cashfree_secret',
  'cashfreeSecret',
  'twilio_auth_token',
  'fcm_server_key',
  'openai_api_key',
];

const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-csrf-token',
  'set-cookie',
];

export function redactObject<T extends Record<string, any>>(obj: T, depth = 0): T {
  if (depth > 5 || obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item as Record<string, any>, depth + 1)) as unknown as T;
  }
  const sanitized = { ...obj } as Record<string, any>;
  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((f) => lowerKey.includes(f))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = redactObject(sanitized[key] as Record<string, any>, depth + 1);
    }
  }
  return sanitized as T;
}

export function redactHeaders(headers: Record<string, any> = {}): Record<string, any> {
  const sanitized = { ...headers };
  for (const header of Object.keys(sanitized)) {
    const lowerHeader = header.toLowerCase();
    if (SENSITIVE_HEADERS.some((h) => lowerHeader.includes(h))) {
      sanitized[header] = '[REDACTED]';
    }
  }
  return sanitized;
}

export function redactError(error: Error): { message: string; stack?: string } {
  return {
    message: error.message,
    stack: error.stack?.split('\n').slice(0, 5).join('\n'),
  };
}

export function isSensitiveField(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_FIELDS.some((f) => lowerKey.includes(f));
}

export function sanitizeForLogging(data: any, depth = 0): any {
  if (depth > 5 || data == null) return data;
  if (typeof data === 'string') return data;
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map((item) => sanitizeForLogging(item, depth + 1));
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (isSensitiveField(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeForLogging(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
