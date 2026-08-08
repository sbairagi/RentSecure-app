import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
  Checkbox,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useCurrentSubscription, useCancelSubscription, useSubscriptionStatus } from '../hooks';
import { EmptyState } from '../components/EmptyState';
import { getPlanDisplayName, formatDate } from '../utils/formatting';
import { showMessage } from 'react-native-flash-message';

export default function CancellationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: subscription, isLoading } = useCurrentSubscription();
  const { isExpired, daysRemaining } = useSubscriptionStatus();
  const cancelMutation = useCancelSubscription();
  const [isChecked, setIsChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!subscription) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:write']}>
          <EmptyState
            title="No Subscription"
            description="You don't have an active subscription to cancel."
            actionLabel="Back to Subscription"
            onAction={() => router.back()}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const handleCancel = async () => {
    if (!isChecked) {
      showMessage({
        message: 'Please confirm that you understand the effects of cancellation.',
        type: 'warning',
      });
      return;
    }

    setIsProcessing(true);
    try {
      await cancelMutation.mutateAsync(subscription.id);
      showMessage({
        message: 'Subscription cancelled successfully. You have access until the end of your billing period.',
        type: 'success',
      });
      router.replace('/(drawer)/(tabs)/subscription');
    } catch (error) {
      showMessage({
        message: error instanceof Error ? error.message : 'Failed to cancel subscription',
        type: 'danger',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:write']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.error }]}>
              Cancel Subscription
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              This action cannot be undone
            </Text>
          </View>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Current Plan
              </Text>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Plan</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {subscription.plan?.name ? getPlanDisplayName(subscription.plan.name) : 'Free'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Expires</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {formatDate(subscription.end_date)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.warningCard, { backgroundColor: theme.colors.errorContainer }]}>
            <Card.Content>
              <Text style={[styles.warningTitle, { color: theme.colors.error }]}>
                What happens when you cancel:
              </Text>
              <Text style={[styles.warningText, { color: theme.colors.onSurface }]}>
                • You will retain access until {formatDate(subscription.end_date)}
              </Text>
              <Text style={[styles.warningText, { color: theme.colors.onSurface }]}>
                • Your data will be preserved
              </Text>
              <Text style={[styles.warningText, { color: theme.colors.onSurface }]}>
                • You can resubscribe at any time
              </Text>
              <Text style={[styles.warningText, { color: theme.colors.onSurface }]}>
                • Feature limits will revert to the free plan after expiry
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => setIsChecked(!isChecked)}
                />
                <Text style={[styles.checkboxLabel, { color: theme.colors.onSurface }]}>
                  I understand the effects of cancellation and want to proceed.
                </Text>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.actionsContainer}>
            <Button mode="contained" textColor={theme.colors.error} onPress={handleCancel} loading={isProcessing} disabled={isProcessing} style={styles.button}>
              Confirm Cancellation
            </Button>
            <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
              Keep Subscription
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  warningCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
  },
  button: {
    alignSelf: 'stretch',
  },
});
