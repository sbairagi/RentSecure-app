export function sanitizeRouteInput(input: string | undefined | null): string | undefined {
  if (!input) return undefined;
  return input.replace(/[<>"'&]/g, '').trim().slice(0, 256);
}

export function sanitizeResourceId(id: string | undefined | null): string | undefined {
  if (!id) return undefined;
  const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '').trim();
  if (sanitized.length > 64) {
    return sanitized.slice(0, 64);
  }
  return sanitized;
}

export function sanitizeToken(token: string | undefined | null): string | undefined {
  if (!token) return undefined;
  const sanitized = token.replace(/[\n\r\t]/g, '').trim();
  if (sanitized.length > 128) {
    return sanitized.slice(0, 128);
  }
  return sanitized;
}

export function isSensitiveParameter(key: string): boolean {
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'otp',
    'credential',
    'bank',
    'card',
    'cvv',
    'pin',
    'auth',
    'jwt',
    'session',
    'api_key',
    'private_key',
  ];

  const lowerKey = key.toLowerCase();
  return sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive));
}

export function sanitizeQueryParams(params: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (isSensitiveParameter(key)) {
      continue;
    }
    sanitized[key] = value.replace(/[<>"']/g, '').trim().slice(0, 256);
  }

  return sanitized;
}

export function validateDeepLinkSecurity(payload: Record<string, any>): { safe: boolean; warnings: string[] } {
  const warnings: string[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (isSensitiveParameter(key)) {
      warnings.push(`Sensitive parameter detected: ${key}`);
    }
    if (typeof value === 'string') {
      if (value.length > 1024) {
        warnings.push(`Parameter ${key} exceeds maximum length`);
      }
      if (/[<>"']/.test(value) && !isSensitiveParameter(key)) {
        warnings.push(`Parameter ${key} contains suspicious characters`);
      }
    }
  }

  return {
    safe: warnings.length === 0,
    warnings,
  };
}
