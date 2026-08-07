// @ts-nocheck
import { notificationsRepository } from '../repository/notificationsRepository';

jest.mock('../services/notificationsApi');

describe('notificationsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches notifications with filters', async () => {
    const result = await notificationsRepository.fetchNotifications({ search: 'rent' });
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
  });

  it('marks notification as read', async () => {
    await notificationsRepository.markAsRead(1);
    expect(notificationsRepository.markAsRead).toHaveBeenCalledWith(1);
  });

  it('fetches unread count', async () => {
    const count = await notificationsRepository.fetchUnreadCount();
    expect(typeof count).toBe('number');
  });

  it('saves device token', async () => {
    await notificationsRepository.saveDeviceToken('test-token', 'expo');
    expect(notificationsRepository.saveDeviceToken).toHaveBeenCalled();
  });
});
