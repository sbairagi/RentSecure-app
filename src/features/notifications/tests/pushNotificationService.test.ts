// @ts-nocheck
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import {
  getCategoryForNotificationType,
  registerBackgroundNotificationTask,
  setupNotificationCategories,
} from '../pushNotificationService';

jest.mock('expo-notifications');
jest.mock('expo-task-manager');

describe('pushNotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerBackgroundNotificationTask', () => {
    it('registers the background task without error', async () => {
      Notifications.registerTaskAsync.mockResolvedValue(undefined);
      await expect(registerBackgroundNotificationTask()).resolves.toBeUndefined();
      expect(Notifications.registerTaskAsync).toHaveBeenCalledWith(
        'rentsecure-background-notification'
      );
    });

    it('handles registration failure gracefully', async () => {
      Notifications.registerTaskAsync.mockRejectedValue(new Error('Registration failed'));
      await expect(registerBackgroundNotificationTask()).resolves.toBeUndefined();
    });
  });

  describe('setupNotificationCategories', () => {
    it('registers all notification categories', async () => {
      Notifications.setNotificationCategoryAsync.mockResolvedValue({});
      await expect(setupNotificationCategories()).resolves.toBeUndefined();
      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledTimes(4);
      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
        'rent_action',
        expect.any(Array)
      );
      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
        'maintenance_action',
        expect.any(Array)
      );
      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
        'agreement_action',
        expect.any(Array)
      );
      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
        'subscription_action',
        expect.any(Array)
      );
    });
  });

  describe('getCategoryForNotificationType', () => {
    it('returns correct category for rent notifications', () => {
      expect(getCategoryForNotificationType('rent_due')).toBe('rent_action');
      expect(getCategoryForNotificationType('payment_success')).toBe('rent_action');
      expect(getCategoryForNotificationType('payment_failed')).toBe('rent_action');
    });

    it('returns correct category for maintenance notifications', () => {
      expect(getCategoryForNotificationType('maintenance_created')).toBe('maintenance_action');
      expect(getCategoryForNotificationType('maintenance_update')).toBe('maintenance_action');
    });

    it('returns correct category for agreement notifications', () => {
      expect(getCategoryForNotificationType('agreement_expiry')).toBe('agreement_action');
      expect(getCategoryForNotificationType('agreement_signed')).toBe('agreement_action');
    });

    it('returns correct category for subscription notifications', () => {
      expect(getCategoryForNotificationType('subscription_expiry')).toBe('subscription_action');
      expect(getCategoryForNotificationType('subscription_expired')).toBe('subscription_action');
    });

    it('returns undefined for unknown types', () => {
      expect(getCategoryForNotificationType('unknown_type')).toBeUndefined();
    });
  });
});
