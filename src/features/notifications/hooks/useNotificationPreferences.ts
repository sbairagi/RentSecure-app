import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { notificationsRepository } from '../repository';
import { useNotificationStore } from '../store/notificationStore';

const PREFERENCES_QUERY_KEY = ['notifications', 'preferences'];

export function useNotificationPreferences() {
  const { setPreferences } = useNotificationStore();

  const query = useQuery({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: async () => {
      const prefs = await notificationsRepository.fetchPreferences();
      setPreferences(prefs);
      return prefs;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  return {
    preferences: query.data || useNotificationStore.getState().preferences,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const { setPreferences } = useNotificationStore();

  return useMutation({
    mutationFn: async (prefs: Parameters<typeof notificationsRepository.updatePreferences>[0]) => {
      const result = await notificationsRepository.updatePreferences(prefs);
      return result;
    },
    onSuccess: (_, variables) => {
      const current = useNotificationStore.getState().preferences;
      if (current) {
        setPreferences({ ...current, ...variables });
      }
      queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY });
      showMessage({ message: 'Preferences updated', type: 'success' });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to update preferences',
        type: 'danger',
      });
    },
  });
}
