export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SecureStorageConfig {
  accessTokenKey: string;
  refreshTokenKey: string;
  userKey: string;
  sessionExpiryKey: string;
  lastActivityKey: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  expiresAt: number | null;
  lastActivityAt: number | null;
  isExpired: boolean;
  isInactivityTimeout: boolean;
  remainingMs: number | null;
}

export interface DeviceSecurityResult {
  allowed: boolean;
  reason?: string;
  isRooted: boolean;
  isJailbroken: boolean;
  isEmulator: boolean;
}

export interface DeepLinkValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedPayload?: Record<string, any>;
}

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
  sizeBytes?: number;
}

export interface SensitiveFieldRedactionResult {
  redacted: Record<string, any>;
  fieldsRedacted: string[];
}

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'property_owner'
  | 'renter'
  | 'caretaker'
  | 'ca_partner'
  | 'support_executive'
  | 'user';

export type Permission =
  | 'dashboard:read'
  | 'property:read'
  | 'property:write'
  | 'building:read'
  | 'building:write'
  | 'unit:read'
  | 'unit:write'
  | 'renter:read'
  | 'renter:write'
  | 'caretaker:read'
  | 'caretaker:write'
  | 'payment:read'
  | 'payment:write'
  | 'report:read'
  | 'report:write'
  | 'settings:read'
  | 'settings:write'
  | 'user:read'
  | 'user:write'
  | 'subscription:read'
  | 'subscription:write'
  | 'agreement:read'
  | 'agreement:write'
  | 'notification:read'
  | 'notification:write'
  | 'maintenance:read'
  | 'maintenance:write'
  | 'ai:read';

export type DeepLinkType =
  | 'payment'
  | 'invitation'
  | 'agreement'
  | 'rent_record'
  | 'notification'
  | 'building'
  | 'unit'
  | 'renter'
  | 'caretaker'
  | 'maintenance'
  | 'visitor'
  | 'document'
  | 'subscription'
  | 'general';

export interface DeepLinkPayload {
  type: DeepLinkType;
  id?: string;
  token?: string;
  action?: string;
  [key: string]: any;
}
