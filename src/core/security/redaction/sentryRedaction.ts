import { Redactor } from './redactor';
import { SECURITY_CONSTANTS } from '../constants';

let Sentry: any = null;

try {
  Sentry = require('sentry-expo');
} catch {
  // Sentry not available
}

export class SentryRedactor {
  static setup(): void {
    if (!Sentry) return;

    try {
      Sentry.setUser({
        id: undefined,
        email: undefined,
        username: undefined,
      });

      Sentry.setTags({
        appEnv: process.env.EXPO_PUBLIC_APP_ENV || 'development',
        platform: 'mobile',
      });

      Sentry.setExtra('redaction_enabled', true);
    } catch {
      // Sentry not available
    }
  }

  static sanitizeBeforeSend(event: any): any {
    if (!event) return event;

    const sanitized = { ...event };

    if (sanitized.request) {
      sanitized.request = Redactor.redactHeaders(sanitized.request.headers);
      if (sanitized.request.data) {
        sanitized.request.data = Redactor.redactObject(sanitized.request.data).redacted;
      }
      if (sanitized.request.url) {
        try {
          const url = new URL(sanitized.request.url);
          url.search = '';
          sanitized.request.url = url.toString();
        } catch {
          // Invalid URL, leave as is
        }
      }
    }

    if (sanitized.extra) {
      const redactedExtra: Record<string, any> = {};
      for (const [key, value] of Object.entries(sanitized.extra)) {
        if (typeof value === 'object' && value !== null) {
          redactedExtra[key] = Redactor.redactObject(value as Record<string, any>).redacted;
        } else if (typeof value === 'string') {
          redactedExtra[key] = Redactor.redactString(value);
        } else {
          redactedExtra[key] = value;
        }
      }
      sanitized.extra = redactedExtra;
    }

    if (sanitized.breadcrumbs) {
      sanitized.breadcrumbs = sanitized.breadcrumbs.map((breadcrumb: any) => {
        if (breadcrumb.data) {
          return {
            ...breadcrumb,
            data: Redactor.redactObject(breadcrumb.data).redacted,
          };
        }
        return breadcrumb;
      });
    }

    return sanitized;
  }

  static redactException(error: Error): Error {
    const redacted = new Error(error.message);
    redacted.name = error.name;
    redacted.stack = error.stack?.split('\n').slice(0, 3).join('\n') + '\n[STACK TRUNCATED]';
    return redacted;
  }

  static captureException(error: Error, context?: Record<string, any>): void {
    if (!Sentry) return;

    try {
      const redactedError = this.redactException(error);
      const redactedContext = context
        ? Redactor.redactObject(context).redacted
        : undefined;

      Sentry.captureException(redactedError, {
        extra: redactedContext,
      });
    } catch {
      // Sentry not available
    }
  }

  static captureMessage(message: string, level: string = 'info'): void {
    if (!Sentry) return;

    try {
      const redactedMessage = Redactor.redactString(message);
      Sentry.captureMessage(redactedMessage, level);
    } catch {
      // Sentry not available
    }
  }
}
