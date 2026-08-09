/**
 * Unit tests for notification routing.
 */

import {
  categorizeNotification,
  extractResourceId,
  parseNotificationPayload,
} from '@/navigation/notification-routing/notificationPayload';
import {
  getRouteForNotification,
  routeNotification,
} from '@/navigation/notification-routing/notificationRouter';

describe('Notification Payload Parser', () => {
  it('should categorize rent due notification', () => {
    const category = categorizeNotification('📩 New Rent Due', 'Your rent of ₹8000 is due');
    expect(category).toBe('rent_due');
  });

  it('should categorize rent paid notification', () => {
    const category = categorizeNotification('✅ Rent Paid', 'Your rent payment was successful');
    expect(category).toBe('rent_paid');
  });

  it('should categorize maintenance assigned notification', () => {
    const category = categorizeNotification('Maintenance Assigned', 'A new maintenance task has been assigned to you');
    expect(category).toBe('maintenance_assigned');
  });

  it('should categorize visitor request notification', () => {
    const category = categorizeNotification('New Visitor Request', 'You have a new visitor request');
    expect(category).toBe('visitor_request');
  });

  it('should categorize agreement expiring notification', () => {
    const category = categorizeNotification('Agreement Expiring Soon', 'Your rental agreement will expire soon');
    expect(category).toBe('agreement_expiring');
  });

  it('should categorize subscription expiring notification', () => {
    const category = categorizeNotification('Subscription Expiring', 'Your subscription will expire soon');
    expect(category).toBe('subscription_expiring');
  });

  it('should categorize payment success notification', () => {
    const category = categorizeNotification('Payment Successful', 'Your payment has been processed');
    expect(category).toBe('payment_success');
  });

  it('should categorize KYC completed notification', () => {
    const category = categorizeNotification('KYC Completed', 'Your KYC verification has been approved');
    expect(category).toBe('kyc_completed');
  });

  it('should extract resource ID from message with hash', () => {
    const id = extractResourceId('Rent record #12345 has been paid');
    expect(id).toBe('12345');
  });

  it('should extract resource ID from message with ID prefix', () => {
    const id = extractResourceId('Visitor ID: 456 has been approved');
    expect(id).toBe('456');
  });

  it('should extract resource ID from message with record prefix', () => {
    const id = extractResourceId('Maintenance record 789 has been completed');
    expect(id).toBe('789');
  });

  it('should return undefined when no resource ID found', () => {
    const id = extractResourceId('No resource ID here');
    expect(id).toBeUndefined();
  });

  it('should parse notification payload with data', () => {
    const payload = parseNotificationPayload({
      id: '1',
      title: 'Rent Paid',
      message: 'Your rent has been paid',
      data: { resource_id: '123', resource_type: 'rent_record' },
    });
    expect(payload.category).toBe('rent_paid');
    expect(payload.resourceId).toBe('123');
    expect(payload.resourceType).toBe('rent_record');
  });

  it('should parse notification payload without data', () => {
    const payload = parseNotificationPayload({
      id: '2',
      title: 'New Visitor',
      message: 'You have a new visitor',
    });
    expect(payload.category).toBe('visitor_request');
    expect(payload.resourceId).toBeUndefined();
  });
});

describe('Notification Router', () => {
  it('should route rent due notification to payments', () => {
    const result = routeNotification({
      id: '1',
      title: '📩 New Rent Due',
      message: 'Your rent of ₹8000 is due',
    });
    expect(result.success).toBe(true);
    expect(result.route).toBe('/(drawer)/(tabs)/payments');
  });

  it('should route maintenance assigned to maintenance', () => {
    const result = routeNotification({
      id: '2',
      title: 'Maintenance Assigned',
      message: 'A new task has been assigned',
    });
    expect(result.success).toBe(true);
    expect(result.route).toBe('/(drawer)/(tabs)/maintenance');
  });

  it('should route visitor request to visitors', () => {
    const result = routeNotification({
      id: '3',
      title: 'New Visitor Request',
      message: 'You have a new visitor',
    });
    expect(result.success).toBe(true);
    expect(result.route).toBe('/(drawer)/(tabs)/visitors');
  });

  it('should route agreement expiring to agreements', () => {
    const result = routeNotification({
      id: '4',
      title: 'Agreement Expiring Soon',
      message: 'Your agreement will expire',
    });
    expect(result.success).toBe(true);
    expect(result.route).toBe('/(drawer)/(tabs)/agreements');
  });

  it('should route subscription expiring to subscription', () => {
    const result = routeNotification({
      id: '5',
      title: 'Subscription Expiring',
      message: 'Your subscription will expire',
    });
    expect(result.success).toBe(true);
    expect(result.route).toBe('/(drawer)/(tabs)/subscription');
  });

  it('should route system notification to notifications list', () => {
    const result = routeNotification({
      id: '6',
      title: 'System Update',
      message: 'The system has been updated',
    });
    expect(result.success).toBe(true);
    expect(result.route).toBe('/(drawer)/(tabs)/notifications/list');
  });

  it('should include resource ID when available', () => {
    const result = routeNotification({
      id: '7',
      title: 'Rent Paid',
      message: 'Rent record #12345 has been paid',
    });
    expect(result.success).toBe(true);
    expect(result.resourceId).toBe('12345');
  });
});
