import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import type { UserSubscription, SubscriptionPlan } from '../types';
import { getPlanDisplayName, formatCurrency, formatDate } from '../utils/formatting';
import { subscriptionService } from '../services/subscriptionService';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

interface CurrentPlanCardProps {
  subscription: UserSubscription;
  onUpgrade?: () => void;
  onRenew?: () => void;
  onCancel?: () => void;
}

export function CurrentPlanCard({ subscription, onUpgrade, onRenew, onCancel }: CurrentPlanCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const plan = subscription.plan;
  const status = subscriptionService.getStatus(subscription);
  const daysRemaining = subscriptionService.getDaysRemaining(subscription);
  const isExpired = subscriptionService.isExpired(subscription);
  const isInGrace = subscriptionService.isInGracePeriod(subscription);

  const getStatusColor = () => {
    if (isExpired) return theme.colors.error;
    if (isInGrace) return '#D97706';
    return theme.colors.primary;
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isInGrace) return 'Grace Period';
    if (!subscription.is_active) return 'Inactive';
    return 'Active';
  };

  const price = subscription.is_yearly ? plan?.yearly_price : plan?.monthly_price;

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[styles.planName, { color: theme.colors.onSurface }]}>
              {plan ? getPlanDisplayName(plan.name) : 'Free Plan'}
            </Text>
            <Chip 
              mode="flat" 
              style={{ backgroundColor: getStatusColor() + '20' }}
              textStyle={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </Chip>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {plan ? formatCurrency(price || '0') : 'Free'}
            </Text>
            <Text style={[styles.cycle, { color: theme.colors.onSurfaceVariant }]}>
              {subscription.is_yearly ? 'Yearly' : 'Monthly'}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Start Date</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
              {formatDate(subscription.start_date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Expiry Date</Text>
            <Text style={[styles.detailValue, { color: isExpired ? theme.colors.error : theme.colors.onSurface }]}>
              {formatDate(subscription.end_date)}
            </Text>
          </View>
          {daysRemaining !== null && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Days Remaining</Text>
              <Text style={[styles.detailValue, { color: isExpired ? theme.colors.error : theme.colors.onSurface }]}>
                {isExpired ? 'Expired' : `${daysRemaining} days`}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Billing Cycle</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
              {subscription.is_yearly ? 'Yearly' : 'Monthly'}
            </Text>
          </View>
        </View>

        {!isExpired && (
          <View style={styles.actions}>
            {onUpgrade && (
              <Button mode="contained" onPress={onUpgrade} style={styles.button}>
                Upgrade Plan
              </Button>
            )}
            {onRenew && (
              <Button mode="outlined" onPress={onRenew} style={styles.button}>
                Renew Now
              </Button>
            )}
            {onCancel && (
              <Button mode="text" onPress={onCancel} textColor={theme.colors.error} style={styles.button}>
                Cancel Plan
              </Button>
            )}
          </View>
        )}

        {isExpired && (
          <View style={styles.expiredActions}>
            <Button mode="contained" onPress={onRenew || (() => router.push('/(drawer)/(tabs)/subscription/renew'))} style={styles.button}>
              Renew Subscription
            </Button>
            <Button mode="outlined" onPress={onUpgrade || (() => router.push('/(drawer)/(tabs)/subscription/plans'))} style={styles.button}>
              View Plans
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: '700',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  cycle: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  expiredActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
});
