// @ts-nocheck
import { renderHook, waitFor } from '@testing-library/react-native';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';
import { notificationsRepository } from '../repository/notificationsRepository';

jest.mock('../repository/notificationsRepository');

const mockNotifications = [
  {
    id: 1,
    title: 'Test Notification',
    message: 'Test message',
    is_read: false,
    created_at: new Date().toISOString(),
  },
];

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (notificationsRepository.fetchNotifications as jest.Mock).mockResolvedValue({
      data: mockNotifications,
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    });
    (notificationsRepository.markAsRead as jest.Mock).mockResolvedValue(undefined);
    (notificationsRepository.markAllAsRead as jest.Mock).mockResolvedValue(undefined);
  });

  it('fetches notifications', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.notifications.length).toBeGreaterThan(0));
    expect(notificationsRepository.fetchNotifications).toHaveBeenCalled();
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.isLoading).toBe(true);
  });
});

describe('useMarkAsRead', () => {
  it('marks notification as read', async () => {
    const { result } = renderHook(() => useMarkAsRead());
    result.current.mutate(1);
    await waitFor(() => expect(notificationsRepository.markAsRead).toHaveBeenCalledWith(1));
  });
});

describe('useMarkAllAsRead', () => {
  it('marks all notifications as read via backend endpoint', async () => {
    const { result } = renderHook(() => useMarkAllAsRead());
    result.current.mutate();
    await waitFor(() => expect(notificationsRepository.markAllAsRead).toHaveBeenCalled());
  });
});
