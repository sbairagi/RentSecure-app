import { environment, isDevelopment, isProduction } from '@/config/environment';
import { observabilityLogger } from '../logging';
import { SENTRY_ENABLED_KEY, SENTRY_IGNORED_ERROR_CODES, SENTRY_IGNORED_ERROR_MESSAGES } from '../constants/sentry';
import type { ErrorCategory, ErrorContext } from '../types';
import { getErrorSeverity } from '../utils/classify';

let sentryInitialized = false;
let Sentry: any = null;
let sentryDsnValue: string | undefined;

function getSentryDsn(): string | undefined {
  if (sentryDsnValue === undefined) {
    try {
      const env = require('@/config/environment');
      sentryDsnValue = env.sentryDsn || process.env.SENTRY_DSN || '';
    } catch {
      sentryDsnValue = process.env.SENTRY_DSN || '';
    }
  }
  return sentryDsnValue || undefined;
}

function getSentrySDK(): any {
  if (Sentry) return Sentry;
  try {
    Sentry = require('@sentry/react-native');
    return Sentry;
  } catch {
    try {
      Sentry = require('@sentry/expo');
      return Sentry;
    } catch {
      return null;
    }
  }
}

export function isSentryEnabled(): boolean {
  const enabled = process.env[SENTRY_ENABLED_KEY];
  if (enabled !== undefined) return enabled === 'true';
  return !!getSentryDsn();
}

export function initSentry(): void {
  if (sentryInitialized) return;
  if (!isSentryEnabled()) {
    observabilityLogger.info('Sentry disabled: no DSN or flag off');
    return;
  }

  const sdk = getSentrySDK();
  if (!sdk) {
    observabilityLogger.warn('Sentry SDK not installed - run: npm install @sentry/react-native');
    return;
  }

  try {
    const dsn = getSentryDsn();
    if (!dsn) {
      observabilityLogger.info('Sentry disabled: empty DSN');
      return;
    }

    sdk.init({
      dsn,
      environment: environment.appEnv,
      release: `securenest@${environment.appVersion}`,
      attachStacktrace: true,
      autoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      tracesSampleRate: isProduction ? 0.1 : isDevelopment ? 1.0 : 0.2,
      replaysSessionSampleRate: isProduction ? 0.0 : isDevelopment ? 0.0 : 0.0,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event: any, hint: any) {
        const error = hint?.originalException;
        if (shouldIgnoreError(error)) {
          return null;
        }
        sanitizeSentryEvent(event);
        return event;
      },
      beforeBreadcrumb(breadcrumb: any) {
        sanitizeBreadcrumb(breadcrumb);
        return breadcrumb;
      },
      integrations: (integrations: any[]) => {
        return integrations.filter(
          (integration: any) => integration.name !== 'OnDeviceCompat' && integration.name !== 'Screenshot'
        );
      },
    });

    sentryInitialized = true;
    observabilityLogger.info('Sentry initialized', { environment: environment.appEnv, dsn: dsn.slice(0, 8) + '...' });
  } catch (error) {
    observabilityLogger.warn('Sentry initialization failed', { error: error instanceof Error ? error.message : String(error) });
  }
}

export function reportError(
  error: Error,
  category: ErrorCategory = 'UNKNOWN_ERROR',
  context?: ErrorContext,
  extra?: Record<string, any>
): void {
  const severity = getErrorSeverity(category);

  if (isSentryEnabled() && sentryInitialized) {
    try {
      const sdk = getSentrySDK();
      if (!sdk) return;

      const scope = sdk.getCurrentScope ? sdk.getCurrentScope() : new sdk.Scope();

      scope.setTag('error_category', category);
      scope.setTag('error_severity', severity);
      scope.setLevel(severity === 'critical' || severity === 'high' ? 'error' : 'info');

      if (context?.correlationId) scope.setExtra('correlation_id', context.correlationId);
      if (context?.requestId) scope.setExtra('request_id', context.requestId);
      if (context?.endpoint) scope.setExtra('endpoint', context.endpoint);
      if (context?.method) scope.setExtra('method', context.method);
      if (context?.statusCode) scope.setExtra('status_code', context.statusCode);
      if (context?.userId) sdk.setUser({ id: context.userId });
      if (context?.userRole) scope.setExtra('user_role', context.userRole);
      if (context?.platform) scope.setExtra('platform', context.platform);
      if (context?.appVersion) scope.setExtra('app_version', context.appVersion);

      if (extra && Object.keys(extra).length > 0) {
        for (const [key, value] of Object.entries(extra)) {
          scope.setExtra(key, value);
        }
      }

      sdk.captureException(error, scope);
    } catch {
      // Sentry not available
    }
  }

  observabilityLogger.error(`Reported error [${category}]: ${error.message}`, {
    category,
    severity,
    ...context,
  });
}

export function reportBreadcrumb(message: string, category = 'info', data?: Record<string, any>): void {
  if (isSentryEnabled() && sentryInitialized) {
    try {
      const sdk = getSentrySDK();
      if (!sdk) return;
      sdk.addBreadcrumb({
        message,
        category: category.toLowerCase(),
        level: category === 'error' || category === 'warning' ? category.toLowerCase() : 'info',
        data: data ? sanitizeBreadcrumbData(data) : undefined,
      });
    } catch {
      // Sentry not available
    }
  }
}

function shouldIgnoreError(error: any): boolean {
  if (!error) return false;
  const message = (error.message || '').toLowerCase();
  const code = (error.code || '').toLowerCase();

  if (SENTRY_IGNORED_ERROR_MESSAGES.some((m) => message.includes(m.toLowerCase()))) return true;
  if (SENTRY_IGNORED_ERROR_CODES.some((c) => code.includes(c.toLowerCase()))) return true;

  if (error.response?.status === 401 || error.response?.status === 403) return true;

  return false;
}

function sanitizeSentryEvent(event: any): void {
  if (event.request) {
    event.request = sanitizeRequest(event.request);
  }
  if (event.exception?.values) {
    for (const exc of event.exception.values) {
      if (exc.stacktrace?.frames) {
        for (const frame of exc.stacktrace.frames) {
          if (frame.vars) {
            frame.vars = sanitizeObjectDeep(frame.vars);
          }
        }
      }
    }
  }
  if (event.extra) {
    for (const [key, value] of Object.entries(event.extra)) {
      if (typeof value === 'object' && value !== null) {
        event.extra[key] = sanitizeObjectDeep(value);
      }
    }
  }
}

function sanitizeRequest(request: any): any {
  if (!request) return request;
  const sanitized = { ...request };
  if (sanitized.headers) {
    sanitized.headers = sanitizeHeaders(sanitized.headers);
  }
  if (sanitized.data) {
    sanitized.data = sanitizeObjectDeep(sanitized.data);
  }
  if (sanitized.query_string) {
    sanitized.query_string = sanitizeQueryString(sanitized.query_string);
  }
  return sanitized;
}

function sanitizeHeaders(headers: Record<string, any> = {}): Record<string, any> {
  const sensitive = ['authorization', 'cookie', 'x-csrf-token', 'set-cookie', 'proxy-authorization'];
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (sensitive.some((s) => lowerKey.includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function sanitizeBreadcrumb(breadcrumb: any): any {
  if (breadcrumb.data) {
    breadcrumb.data = sanitizeObjectDeep(breadcrumb.data);
  }
  return breadcrumb;
}

function sanitizeBreadcrumbData(data: Record<string, any>): Record<string, any> {
  const sensitive = ['password', 'token', 'secret', 'authorization', 'cookie', 'body'];
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (sensitive.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function sanitizeObjectDeep(obj: any, depth = 0): any {
  if (depth > 3 || obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObjectDeep(item, depth + 1));

  const sensitive = ['password', 'token', 'secret', 'access', 'refresh', 'authorization', 'otp', 'cvv', 'card'];
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (sensitive.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObjectDeep(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function sanitizeQueryString(queryString: string): string {
  const sensitiveParams = ['password', 'token', 'secret', 'access', 'refresh', 'authorization', 'otp', 'api_key'];
  const params = new URLSearchParams(queryString);
  for (const [key] of params) {
    if (sensitiveParams.some((s) => key.toLowerCase().includes(s))) {
      params.set(key, '[REDACTED]');
    }
  }
  return params.toString();
}

export function flushSentry(): Promise<void> {
  if (isSentryEnabled() && sentryInitialized) {
    try {
      const sdk = getSentrySDK();
      if (!sdk) return Promise.resolve();
      return sdk.flush(2000);
    } catch {
      return Promise.resolve();
    }
  }
  return Promise.resolve();
}
