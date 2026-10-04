import { Platform } from 'react-native';
import { observabilityLogger } from '../logging';
import { SLOW_REQUEST_THRESHOLD_MS, VERY_SLOW_REQUEST_THRESHOLD_MS } from '../constants/performance';
import type { PerformanceMetric } from '../types';

const performanceMetrics: PerformanceMetric[] = [];
const MAX_METRICS = 500;

export function trackApiPerformance(
  endpoint: string,
  method: string,
  durationMs: number,
  statusCode: number,
  correlationId?: string,
  context?: Record<string, any>
): void {
  const threshold = SLOW_REQUEST_THRESHOLD_MS;
  const isSlow = durationMs >= threshold;
  const isVerySlow = durationMs >= VERY_SLOW_REQUEST_THRESHOLD_MS;

  const metric: PerformanceMetric = {
    name: `${method} ${endpoint}`,
    durationMs,
    thresholdMs: threshold,
    isSlow,
    timestamp: Date.now(),
    context: {
      statusCode,
      method,
      endpoint,
      correlationId,
      platform: Platform.OS,
      isSlow,
      isVerySlow,
      ...context,
    },
  };

  performanceMetrics.push(metric);
  if (performanceMetrics.length > MAX_METRICS) {
    performanceMetrics.shift();
  }

  if (isVerySlow) {
    observabilityLogger.warn('Very slow API request detected', {
      ...metric.context,
      durationMs,
      thresholdMs: threshold,
    });
  } else if (isSlow) {
    observabilityLogger.info('Slow API request detected', {
      ...metric.context,
      durationMs,
      thresholdMs: threshold,
    });
  }
}

export function trackScreenLoad(screenName: string, loadTimeMs: number): void {
  const threshold = 2000;
  const isSlow = loadTimeMs >= threshold;

  observabilityLogger.info('Screen load time', {
    screen: screenName,
    loadTimeMs,
    isSlow,
    threshold,
    platform: Platform.OS,
  });
}

export function trackAppStartup(startupTimeMs: number): void {
  const threshold = 5000;
  const isSlow = startupTimeMs >= threshold;

  observabilityLogger.info('App startup time', {
    startupTimeMs,
    isSlow,
    threshold,
    platform: Platform.OS,
  });
}

export function trackNavigationPerformance(from: string, to: string, durationMs: number): void {
  const threshold = 500;
  const isSlow = durationMs >= threshold;

  observabilityLogger.info('Navigation performance', {
    from,
    to,
    durationMs,
    isSlow,
    threshold,
    platform: Platform.OS,
  });
}

export function trackImageUpload(durationMs: number, fileSizeBytes: number): void {
  const threshold = 30000;
  const isSlow = durationMs >= threshold;

  observabilityLogger.info('Image upload performance', {
    durationMs,
    fileSizeBytes,
    isSlow,
    threshold,
    platform: Platform.OS,
  });
}

export function trackDocumentUpload(durationMs: number, fileSizeBytes: number): void {
  const threshold = 30000;
  const isSlow = durationMs >= threshold;

  observabilityLogger.info('Document upload performance', {
    durationMs,
    fileSizeBytes,
    isSlow,
    threshold,
    platform: Platform.OS,
  });
}

export function getSlowMetrics(thresholdMs: number = SLOW_REQUEST_THRESHOLD_MS): PerformanceMetric[] {
  return performanceMetrics.filter((m) => m.isSlow && m.durationMs >= thresholdMs);
}

export function getRecentMetrics(limit: number = 50): PerformanceMetric[] {
  return performanceMetrics.slice(-limit);
}

export function clearMetrics(): void {
  performanceMetrics.length = 0;
}

export function getMetricsCount(): number {
  return performanceMetrics.length;
}
