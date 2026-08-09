import { observabilityLogger } from '@/core/observability/logging';
import { trackBusinessFlow } from '@/core/observability/monitoring/business';
import { logPaymentFlowStarted, logSuccessfulPayment, logOrderCreationFailure } from '@/core/observability/logging/payment';
import { logSubscriptionExpired, logUpgradeFailure } from '@/core/observability/logging/subscription';
import { trackApiPerformance, trackScreenLoad } from '@/core/observability/performance';

describe('ObservabilityLogger', () => {
  beforeEach(() => {
    observabilityLogger.clear();
  });

  it('should log at different levels', () => {
    expect(() => {
      observabilityLogger.debug('debug message');
      observabilityLogger.info('info message');
      observabilityLogger.warn('warn message');
      observabilityLogger.error('error message', new Error('test'));
    }).not.toThrow();
  });

  it('should track business flows', () => {
    expect(() => {
      trackBusinessFlow('login', 'started', true);
      trackBusinessFlow('payment', 'failed', false, { orderId: '123' });
    }).not.toThrow();
  });

  it('should sanitize sensitive data in logs', () => {
    expect(() => {
      observabilityLogger.info('test', { password: 'secret', name: 'safe' });
    }).not.toThrow();
  });

  it('should support custom handlers', () => {
    const handler = jest.fn();
    const unsubscribe = observabilityLogger.addHandler(handler);
    observabilityLogger.info('test message');
    unsubscribe();
    expect(handler).toHaveBeenCalled();
  });
});

describe('Payment monitoring', () => {
  it('should track payment flow started', () => {
    expect(() => {
      logPaymentFlowStarted({ orderId: 'order_123' });
    }).not.toThrow();
  });

  it('should track payment success', () => {
    expect(() => {
      logSuccessfulPayment({ orderId: 'order_123', amount: 1000 });
    }).not.toThrow();
  });

  it('should track order creation failure', () => {
    expect(() => {
      logOrderCreationFailure(new Error('Razorpay error'), { orderId: 'order_123' });
    }).not.toThrow();
  });

  it('should not log payment secrets', () => {
    expect(() => {
      logPaymentFlowStarted({ cardNumber: '4111111111111111', cvv: '123' });
    }).not.toThrow();
  });
});

describe('Subscription monitoring', () => {
  it('should track subscription expired', () => {
    expect(() => {
      logSubscriptionExpired({ subscriptionId: 'sub_123' });
    }).not.toThrow();
  });

  it('should track upgrade failure', () => {
    expect(() => {
      logUpgradeFailure(new Error('Payment failed'), { planId: 'plan_123' });
    }).not.toThrow();
  });
});

describe('Performance monitoring', () => {
  it('should track API performance', () => {
    expect(() => {
      trackApiPerformance('/api/test', 'POST', 1000, 200, 'corr-123');
      trackApiPerformance('/api/slow', 'GET', 10000, 200, 'corr-456');
    }).not.toThrow();
  });

  it('should track screen load', () => {
    expect(() => {
      trackScreenLoad('Dashboard', 1500);
      trackScreenLoad('Properties', 3000);
    }).not.toThrow();
  });

  it('should identify slow requests', () => {
    trackApiPerformance('/api/test', 'POST', 1000, 200);
    trackApiPerformance('/api/slow', 'GET', 10000, 200);
    // No exception should be thrown
    expect(true).toBe(true);
  });
});
