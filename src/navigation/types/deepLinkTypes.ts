import type { DeepLinkType, DeepLinkPayload, UserRole } from './navigation.types';

export interface DeepLinkConfig {
  scheme: string;
  host: string;
  prefixes: string[];
  routes: Record<string, DeepLinkRouteMapping>;
}

export interface DeepLinkRouteMapping {
  pattern: string;
  routeName: string;
  requiredRoles?: UserRole[];
  requiresAuth?: boolean;
  paramExtractors?: Record<string, (segments: string[], params: URLSearchParams) => string | undefined>;
}

export interface ParsedDeepLink {
  raw: string;
  payload: DeepLinkPayload;
  routeName: string;
  params: Record<string, string>;
  isValid: boolean;
  validationError?: string;
}

export interface DeepLinkValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedPayload?: DeepLinkPayload;
}
