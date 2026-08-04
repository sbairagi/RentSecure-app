const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
} as const;

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

type LogEntry = {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
};

class Logger {
  private currentLevel: LogLevel = LOG_LEVELS.DEBUG;
  private entries: LogEntry[] = [];
  private maxEntries = 1000;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : true;
    if (!this.isDevelopment) {
      this.currentLevel = LOG_LEVELS.ERROR;
    }
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LOG_LEVELS)[level];
    return `[${timestamp}] [${levelName}] ${message}`;
  }

  private addEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    stack?: string
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      stack,
    };

    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.addEntry(LOG_LEVELS.DEBUG, message, context);
    if (this.isDevelopment) {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message), context || '');
    }
  }

  info(message: string, context?: Record<string, any>): void {
    this.addEntry(LOG_LEVELS.INFO, message, context);
    console.log(this.formatMessage(LOG_LEVELS.INFO, message), context || '');
  }

  warn(message: string, context?: Record<string, any>): void {
    this.addEntry(LOG_LEVELS.WARN, message, context);
    console.warn(this.formatMessage(LOG_LEVELS.WARN, message), context || '');
  }

  error(message: string, error?: Error | Record<string, any>): void {
    const context = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    this.addEntry(
      LOG_LEVELS.ERROR,
      message,
      context,
      error instanceof Error ? error.stack : undefined
    );
    console.error(this.formatMessage(LOG_LEVELS.ERROR, message), context || '');
  }

  logRequest(config: Record<string, any>, correlationId?: string): void {
    if (!this.shouldLog(LOG_LEVELS.DEBUG)) return;
    this.debug('API Request', {
      correlationId,
      method: config.method,
      url: config.url,
      headers: this.sanitizeHeaders(config.headers),
      params: config.params,
      data: this.sanitizeData(config.data),
    });
  }

  logResponse(response: Record<string, any>, duration: number, correlationId?: string): void {
    if (!this.shouldLog(LOG_LEVELS.DEBUG)) return;
    this.debug('API Response', {
      correlationId,
      status: response.status,
      duration: `${duration}ms`,
      url: response.config?.url,
      data: this.sanitizeData(response.data),
    });
  }

  logError(error: Error, config?: Record<string, any>, correlationId?: string): void {
    this.error(`API Error: ${error.message}`, {
      correlationId,
      url: config?.url,
      method: config?.method,
      status: (error as any).response?.status,
      message: error.message,
      stack: error.stack,
    });
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  private sanitizeHeaders(headers?: Record<string, string>): Record<string, string> {
    if (!headers) return {};
    const sanitized = { ...headers };
    if (sanitized.Authorization) {
      sanitized.Authorization = '[REDACTED]';
    }
    return sanitized;
  }

  private sanitizeData(data?: any): any {
    if (!data) return data;
    if (typeof data !== 'object') return data;
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'access', 'refresh', 'authorization'];
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    return sanitized;
  }
}

export const logger = new Logger();
export { LOG_LEVELS };
