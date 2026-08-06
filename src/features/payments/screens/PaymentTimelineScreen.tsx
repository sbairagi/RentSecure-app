import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import { usePaymentTimeline } from '../hooks';
import { PaymentTimelineItem, PaymentEmptyState } from '../components';
import type { PaymentTimelineEntry } from '../types/payments';

export default function PaymentTimelineScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const paymentId = params.id;

  const { timeline, isLoading, error } = usePaymentTimeline(paymentId);

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
              Loading timeline...
            </Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={styles.container}>
            <PaymentEmptyState
              title="Error loading timeline"
              description={error}
              icon="⚠️"
            />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Payment Timeline
            </Text>
          </View>

          {!timeline || timeline.length === 0 ? (
            <PaymentEmptyState
              title="No timeline events"
              description="Timeline events will appear here."
            />
          ) : (
            <View style={styles.timeline}>
              {timeline.map((entry: PaymentTimelineEntry) => (
                <PaymentTimelineItem key={entry.id} entry={entry} />
              ))}
            </View>
          )}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  timeline: {
    padding: 16,
  },
});
