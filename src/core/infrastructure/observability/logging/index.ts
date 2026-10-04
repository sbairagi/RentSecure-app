import { logger } from '@/services/api/logger';
import type { LogEntry, LogLevel } from '../types';
import { sanitizeForLogging } from '../utils/redact';

const LEVEL_NAMES: Record<number, LogLevel> = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
  4: 'ERROR',
  5: 'FATAL',
};

type LogHandler = (entry: LogEntry) => void;

class ObservabilityLogger {
  private handlers: Set<LogHandler> = new Set();
  private businessHandlers: Set<(event: Record<string, any>) => void> = new Set();

  addHandler(handler: LogHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  addBusinessHandler(handler: (event: Record<string, any>) => void): () => void {
    this.businessHandlers.add(handler);
    return () => {
      this.businessHandlers.delete(handler);
    };
  }

  private emit(entry: LogEntry): void {
    for (const handler of this.handlers) {
      try {
        handler(entry);
      } catch {
        // swallow handler errors
      }
    }
  }

  private emitBusiness(event: Record<string, any>): void {
    for (const handler of this.businessHandlers) {
      try {
        handler(event);
      } catch {
        // swallow handler errors
      }
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const sanitized = context ? sanitizeForLogging(context) : undefined;
    logger.debug(message, sanitized);
    this.emit({
      timestamp: Date.now(),
      level: 'DEBUG',
      message,
      context: sanitized,
    });
  }

  info(message: string, context?: Record<string, any>): void {
    const sanitized = context ? sanitizeForLogging(context) : undefined;
    logger.info(message, sanitized);
    this.emit({
      timestamp: Date.now(),
      level: 'INFO',
      message,
      context: sanitized,
    });
  }

  warn(message: string, context?: Record<string, any>): void {
    const sanitized = context ? sanitizeForLogging(context) : undefined;
    logger.warn(message, sanitized);
    this.emit({
      timestamp: Date.now(),
      level: 'WARN',
      message,
      context: sanitized,
    });
  }

  error(message: string, errorOrContext?: Error | Record<string, any>): void {
    const context = errorOrContext instanceof Error ? { message: errorOrContext.message } : errorOrContext;
    const sanitized = context ? sanitizeForLogging(context) : undefined;
    const stack = errorOrContext instanceof Error ? errorOrContext.stack : undefined;
    logger.error(message, sanitized);
    this.emit({
      timestamp: Date.now(),
      level: 'ERROR',
      message,
      context: sanitized,
      stack,
    });
  }

  fatal(message: string, errorOrContext?: Error | Record<string, any>): void {
    this.error(message, errorOrContext);
    this.emit({
      timestamp: Date.now(),
      level: 'FATAL',
      message,
      context: errorOrContext instanceof Error ? { message: errorOrContext.message } : errorOrContext,
      stack: errorOrContext instanceof Error ? errorOrContext.stack : undefined,
    });
  }

  logRequest(config: Record<string, any>, correlationId?: string): void {
    const sanitized = {
      correlationId,
      method: config.method,
      url: config.url,
      headers: sanitizeForLogging(config.headers),
      params: config.params,
    };
    logger.logRequest(config, correlationId);
    this.emit({
      timestamp: Date.now(),
      level: 'DEBUG',
      message: 'API Request',
      context: sanitized,
    });
  }

  logResponse(response: Record<string, any>, duration: number, correlationId?: string): void {
    const sanitized = {
      correlationId,
      status: response.status,
      duration: `${duration}ms`,
      url: response.config?.url,
    };
    logger.logResponse(response, duration, correlationId);
    this.emit({
      timestamp: Date.now(),
      level: 'DEBUG',
      message: 'API Response',
      context: sanitized,
    });
  }

  logApiError(error: Error, config?: Record<string, any>, correlationId?: string): void {
    const sanitized = {
      correlationId,
      url: config?.url,
      method: config?.method,
      status: (error as any).response?.status,
      message: error.message,
    };
    logger.logError(error, config, correlationId);
    this.emit({
      timestamp: Date.now(),
      level: 'ERROR',
      message: 'API Error',
      context: sanitized,
      stack: error.stack,
    });
  }

  trackBusinessFlow(flow: string, step: string, success: boolean, context?: Record<string, any>): void {
    const event = {
      flow,
      step,
      success,
      timestamp: Date.now(),
      ...sanitizeForLogging(context || {}),
    };
    this.info(`Business flow: ${flow}.${step}`, event);
    this.emitBusiness(event);
  }

  trackPaymentFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('payment', step, success, context);
  }

  trackSubscriptionFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('subscription', step, success, context);
  }

  trackAuthFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('auth', step, success, context);
  }

  trackUploadFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('upload', step, success, context);
  }

  trackNotificationFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('notification', step, success, context);
  }

  trackSearchFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('search', step, success, context);
  }

  trackAiFlow(step: string, success: boolean, context?: Record<string, any>): void {
    this.trackBusinessFlow('ai', step, success, context);
  }

  getEntries(): LogEntry[] {
    const entries = logger.getEntries();
    return entries.map((entry) => ({
      ...entry,
      level: LEVEL_NAMES[entry.level] || 'UNKNOWN',
    })) as LogEntry[];
  }

  clear(): void {
    logger.clear();
  }

  exportLogs(): string {
    return logger.exportLogs();
  }
}

export const observabilityLogger = new ObservabilityLogger();
