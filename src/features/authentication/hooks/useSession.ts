import { useAuthStore } from '@/store/authStore';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useSession = () => {
  const appState = useRef<AppStateStatus>('active');

  const { isAuthenticated, logout, updateLastActivity, isSessionExpired, isInactivityTimeout } =
    useAuthStore();

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;
    updateLastActivity();
  }, [isAuthenticated, updateLastActivity]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (!isAuthenticated) return;

        const sessionExpired = isSessionExpired();
        const inactivityTimedOut = isInactivityTimeout();

        if (sessionExpired || inactivityTimedOut) {
          setTimeout(() => {
            logout();
          }, 0);
        }
      }
      appState.current = nextAppState;
    },
    [isAuthenticated, isSessionExpired, isInactivityTimeout, logout]
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, handleAppStateChange]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (isSessionExpired() || isInactivityTimeout()) {
        setTimeout(() => {
          logout();
        }, 0);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isSessionExpired, isInactivityTimeout, logout]);

  return {
    isSessionExpired,
    isInactivityTimeout,
    resetTimer,
    handleInteraction: resetTimer,
  };
};
