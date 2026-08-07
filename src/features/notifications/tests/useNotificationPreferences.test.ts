// @ts-nocheck
import { renderHook, waitFor } from '@testing-library/react-native';
import { useNotificationPreferences, useUpdatePreferences } from '../hooks/useNotificationPreferences';

jest.mock('../repository/notificationsRepository', () => ({
  notificationsRepository: {
    fetchPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));


describe('useNotificationPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches preferences', async () => {
    const { result } = renderHook(() => useNotificationPreferences());
    await waitFor(() => expect(result.current.preferences).toBeDefined());
  });
});

describe('useUpdatePreferences', () => {
  it('updates preferences', async () => {
    const { result } = renderHook(() => useUpdatePreferences());
    result.current.mutate({ rent_alerts_whatsapp: false });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
