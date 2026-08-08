import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Divider,
  Button,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useEffectiveLimits, useSubscriptionStatus } from '../hooks';
import { FeatureLimitRow } from '../components/FeatureLimitRow';
import { EmptyState } from '../components/EmptyState';
import { FEATURE_LABELS } from '../types/limits';

export default function SubscriptionUsageScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: effectiveLimits, isLoading } = useEffectiveLimits();
  const { isExpired } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading usage data...</Text>
      </View>
    );
  }

  if (isExpired) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <EmptyState
            title="Subscription Expired"
            description="Your subscription has expired. Usage data is not available for expired subscriptions."
            actionLabel="Renew Subscription"
            onAction={() => router.push('/(drawer)/(tabs)/subscription/renew')}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Subscription Usage
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Monitor your feature usage and remaining capacity
            </Text>
          </View>

          {effectiveLimits && effectiveLimits.length > 0 ? (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                {effectiveLimits.map(limit => (
                  <FeatureLimitRow
                    key={limit.featureKey}
                    limit={limit}
                    onPress={() => router.push('/(drawer)/(tabs)/subscription/add-ons')}
                  />
                ))}
              </Card.Content>
            </Card>
          ) : (
            <EmptyState
              title="No Usage Data"
              description="Usage data will appear here once you start using the app features."
            />
          )}

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/add-ons')} style={styles.button}>
              Purchase Add-ons
            </Button>
            <Button mode="outlined" onPress={() => router.push('/(drawer)/(tabs)/subscription/upgrade')} style={styles.button}>
              Upgrade Plan
            </Button>
          </View>
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  button: {
    flex: 1,
  },
});
