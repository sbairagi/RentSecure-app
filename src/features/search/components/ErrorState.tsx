import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  errorType?: 'network' | 'timeout' | 'unauthorized' | 'forbidden' | 'not_found' | 'validation' | 'rate_limited' | 'server_error' | 'offline' | 'subscription_expired' | 'generic';
}

export function ErrorState({ message, onRetry, errorType = 'generic' }: ErrorStateProps) {
  const theme = useTheme();

  const getIcon = () => {
    switch (errorType) {
      case 'network':
      case 'offline':
        return '📡';
      case 'timeout':
        return '⏱️';
      case 'unauthorized':
        return '🔒';
      case 'forbidden':
        return '🚫';
      case 'not_found':
        return '🔍';
      case 'validation':
        return '⚠️';
      case 'rate_limited':
        return '⏳';
      case 'server_error':
        return '💥';
      case 'subscription_expired':
        return '⭐';
      default:
        return '❌';
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case 'network':
      case 'offline':
        return 'No internet connection';
      case 'timeout':
        return 'Request timed out';
      case 'unauthorized':
        return 'Session expired';
      case 'forbidden':
        return 'Access denied';
      case 'not_found':
        return 'Not found';
      case 'validation':
        return 'Invalid request';
      case 'rate_limited':
        return 'Too many requests';
      case 'server_error':
        return 'Server error';
      case 'subscription_expired':
        return 'Subscription expired';
      default:
        return 'Something went wrong';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {getTitle()}
      </Text>
      <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
      <View style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.retryText} onPress={onRetry}>Try Again</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
