import { reportError } from '../monitoring/sentry';
import { observabilityLogger } from '../logging';
import type { ErrorCategory, ErrorContext } from '../types';
import { buildErrorContext, classifyHttpError, classifyNetworkError, isRetryable } from '../utils/classify';
import { ERROR_USER_MESSAGES } from '../constants/errors';
import { reportBreadcrumb } from '../monitoring/sentry';

export interface ReportedError {
  category: ErrorCategory;
  userMessage: string;
  context: ErrorContext;
  isRetryable: boolean;
}

export class ErrorReporter {
  report(error: any, context?: Partial<ErrorContext>): ReportedError {
    const category = this.categorize(error);
    const fullContext = buildErrorContext(error, context);
    const userMessage = ERROR_USER_MESSAGES[category];
    const retryable = isRetryable(error);

    if (category !== 'AUTHENTICATION_ERROR' && category !== 'AUTHORIZATION_ERROR') {
      reportError(error instanceof Error ? error : new Error(String(error)), category, fullContext);
    }

    if (category === 'AUTHENTICATION_ERROR') {
      reportBreadcrumb('Authentication error detected - will attempt token refresh', 'warning', fullContext);
    }

    observabilityLogger.error(`Reported [${category}]: ${error?.message || String(error)}`, {
      category,
      ...fullContext,
    });

    return {
      category,
      userMessage,
      context: fullContext,
      isRetryable: retryable,
    };
  }

  categorize(error: any): ErrorCategory {
    if (!error) return 'UNKNOWN_ERROR';

    const statusCode = error?.response?.status || error?.statusCode;
    if (statusCode) {
      const httpCategory = classifyHttpError(statusCode);
      if (httpCategory !== 'UNKNOWN_ERROR') return httpCategory;
    }

    if (error?.code || error?.message) {
      const networkCategory = classifyNetworkError(error);
      if (networkCategory !== 'UNKNOWN_ERROR') return networkCategory;
    }

    const message = (error?.message || '').toLowerCase();
    if (message.includes('payment') || message.includes('razorpay') || message.includes('cashfree')) return 'PAYMENT_ERROR';
    if (message.includes('subscription')) return 'SUBSCRIPTION_ERROR';
    if (message.includes('upload') || message.includes('document')) return 'UPLOAD_ERROR';
    if (message.includes('network') || message.includes('offline')) return 'NETWORK_ERROR';
    if (message.includes('timeout')) return 'TIMEOUT';

    return 'UNKNOWN_ERROR';
  }
}

export const errorReporter = new ErrorReporter();
