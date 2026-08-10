import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { networkManager } from '@/services/api/networkManager';
import { requestQueue } from '@/services/api/requestQueue';
import { queryClient } from '@/providers/queryClient';
import { logger } from '@/services/api/logger';

type BannerState = 'offline' | 'syncing' | 'success' | 'hidden';

const BANNER_MESSAGES: Record<BannerState, string> = {
  offline: 'You are offline. Showing saved data.',
  syncing: 'Back online. Syncing...',
  success: 'All data is up to date.',
  hidden: '',
};

export function OfflineBanner() {
  const [bannerState, setBannerState] = useState<BannerState>('hidden');
  const [message, setMessage] = useState('');
  const [showDismiss, setShowDismiss] = useState(false);
  const previousStatus = useRef<string>('unknown');
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBannerShownAt = useRef(0);
  const MIN_BANNER_INTERVAL = 5000;
  const opacity = useState(new Animated.Value(0))[0];

  const showBanner = useCallback(
    (state: BannerState, msg: string, dismissible = false) => {
      const now = Date.now();
      if (now - lastBannerShownAt.current < MIN_BANNER_INTERVAL && state === 'offline') {
        return;
      }
      lastBannerShownAt.current = now;

      if (syncTimer.current) clearTimeout(syncTimer.current);
      if (successTimer.current) clearTimeout(successTimer.current);

      setBannerState(state);
      setMessage(msg);
      setShowDismiss(dismissible);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [opacity]
  );

  const hideBanner = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setBannerState('hidden');
      setMessage('');
      setShowDismiss(false);
    });
  }, [opacity]);

  const handleDismiss = useCallback(() => {
    hideBanner();
  }, [hideBanner]);

  useEffect(() => {
    const status = networkManager.getStatus();
    const currentSyncTimer = syncTimer.current;
    const currentSuccessTimer = successTimer.current;

    if (status === 'offline' && previousStatus.current !== 'offline') {
      previousStatus.current = 'offline';
      showBanner('offline', BANNER_MESSAGES.offline, true);
    } else if (status === 'online' && previousStatus.current === 'offline') {
      previousStatus.current = 'online';
      showBanner('syncing', BANNER_MESSAGES.syncing, false);

      const processSync = async () => {
        try {
          await requestQueue.processQueue();
          await queryClient.invalidateQueries();
        } catch (error) {
          logger.warn('Sync failed', { error: (error as Error).message });
        } finally {
          showBanner('success', BANNER_MESSAGES.success, true);
          successTimer.current = setTimeout(() => {
            hideBanner();
          }, 3000);
        }
      };

      processSync();
    } else if (status === 'online') {
      previousStatus.current = 'online';
    }

    return () => {
      if (currentSyncTimer) clearTimeout(currentSyncTimer);
      if (currentSuccessTimer) clearTimeout(currentSuccessTimer);
    };
  }, [showBanner, hideBanner, opacity]);

  if (bannerState === 'hidden') {
    return null;
  }

  const bgColor =
    bannerState === 'offline'
      ? '#fef2f2'
      : bannerState === 'syncing'
        ? '#fffbeb'
        : '#f0fdf4';

  const textColor =
    bannerState === 'offline'
      ? '#991b1b'
      : bannerState === 'syncing'
        ? '#92400e'
        : '#166534';

  const borderColor =
    bannerState === 'offline'
      ? '#fecaca'
      : bannerState === 'syncing'
        ? '#fde68a'
        : '#bbf7d0';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        {showDismiss && (
          <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
            <Text style={[styles.dismissText, { color: textColor }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9998,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    marginRight: 12,
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.6,
  },
});
