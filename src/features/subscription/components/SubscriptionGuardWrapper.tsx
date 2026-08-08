import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useCurrentSubscription } from '../hooks/useCurrentSubscription';
import { subscriptionService } from '../services/subscriptionService';

interface SubscriptionGuardWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGuardWrapper({ children, fallback }: SubscriptionGuardWrapperProps) {
  const theme = useTheme();
  const { data: subscription, isLoading, error } = useCurrentSubscription();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
          Loading subscription...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.error, textAlign: 'center', padding: 16 }}>
          Failed to load subscription. Please try again.
        </Text>
      </View>
    );
  }

  const isExpired = subscriptionService.isExpired(subscription ?? null);

  if (isExpired) {
    if (fallback) return <>{fallback}</>;
    return (
      <View style={styles.expiredContainer}>
        <Text style={[styles.expiredTitle, { color: theme.colors.error }]}>
          Subscription Expired
        </Text>
        <Text style={[styles.expiredText, { color: theme.colors.onSurfaceVariant }]}>
          Your subscription has expired. Please renew to continue accessing all features.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  expiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  expiredTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  expiredText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
