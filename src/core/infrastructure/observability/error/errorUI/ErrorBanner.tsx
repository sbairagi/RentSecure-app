import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import type { ErrorCategory } from '../../types';

interface ErrorBannerProps {
  category: ErrorCategory;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoHideMs?: number;
  retryLabel?: string;
}

export function ErrorBanner({
  category,
  message,
  onRetry,
  onDismiss,
  autoHideMs = 5000,
  retryLabel = 'Retry',
}: ErrorBannerProps) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const opacity = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (autoHideMs > 0) {
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
          onDismiss?.();
        });
      }, autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [autoHideMs, onDismiss, opacity]);

  if (!visible) return null;

  const bgColor = getBgColor(category);
  const textColor = getTextColor(category);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.replace('/splash');
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor, opacity }]}>
      <View style={styles.content}>
        <Text style={[styles.message, { color: textColor }]} numberOfLines={3}>
          {message}
        </Text>
        <View style={styles.actions}>
          {onRetry && (
            <TouchableOpacity onPress={handleRetry}>
              <Text style={[styles.retryText, { color: textColor }]}>{retryLabel}</Text>
            </TouchableOpacity>
          )}
          {onDismiss && (
            <TouchableOpacity onPress={onDismiss}>
              <Text style={[styles.dismissText, { color: textColor }]}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

function getBgColor(category: ErrorCategory): string {
  switch (category) {
    case 'NETWORK_ERROR':
    case 'OFFLINE':
      return '#fef2f2';
    case 'AUTHENTICATION_ERROR':
      return '#eff6ff';
    case 'AUTHORIZATION_ERROR':
      return '#fffbeb';
    case 'VALIDATION_ERROR':
      return '#eff6ff';
    case 'NOT_FOUND':
      return '#f1f5f9';
    case 'CONFLICT':
    case 'RATE_LIMIT':
      return '#fffbeb';
    case 'SERVER_ERROR':
      return '#fef2f2';
    case 'TIMEOUT':
      return '#fffbeb';
    case 'PAYMENT_ERROR':
    case 'SUBSCRIPTION_ERROR':
      return '#fef2f2';
    default:
      return '#f8fafc';
  }
}

function getTextColor(category: ErrorCategory): string {
  switch (category) {
    case 'NETWORK_ERROR':
    case 'OFFLINE':
    case 'SERVER_ERROR':
    case 'PAYMENT_ERROR':
    case 'SUBSCRIPTION_ERROR':
      return '#991b1b';
    case 'AUTHENTICATION_ERROR':
    case 'VALIDATION_ERROR':
      return '#1e40af';
    case 'AUTHORIZATION_ERROR':
    case 'CONFLICT':
    case 'RATE_LIMIT':
    case 'TIMEOUT':
      return '#92400e';
    default:
      return '#1e293b';
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
});
