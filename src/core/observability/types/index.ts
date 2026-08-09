export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorCategory =
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'TIMEOUT'
  | 'OFFLINE'
  | 'PAYMENT_ERROR'
  | 'UPLOAD_ERROR'
  | 'SUBSCRIPTION_ERROR'
  | 'UNKNOWN_ERROR';

export interface ErrorContext {
  correlationId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  userRole?: string;
  platform?: string;
  appVersion?: string;
  osVersion?: string;
  deviceType?: string;
  networkStatus?: string;
  durationMs?: number;
  retryCount?: number;
}

export interface BusinessErrorEvent {
  flow: string;
  step: string;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  context?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  durationMs: number;
  thresholdMs: number;
  isSlow: boolean;
  timestamp: number;
  context?: Record<string, any>;
}

export interface NetworkStateEvent {
  status: 'online' | 'offline' | 'slow' | 'unknown';
  previousStatus?: string;
  timestamp: number;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
}
