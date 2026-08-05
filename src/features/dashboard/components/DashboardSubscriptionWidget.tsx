import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, ProgressBar, Text, useTheme } from 'react-native-paper';

interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: string;
  yearly_price: string;
  features: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  is_active_subscription: boolean;
  is_yearly: boolean;
}

interface FeatureUsage {
  feature_key: string;
  usage_count: number;
  updated_at: string;
}

interface SubscriptionWidgetProps {
  subscription: SubscriptionPlan | null;
  featureUsage: FeatureUsage[];
  onUpgrade: () => void;
}

const FEATURE_LIMITS: Record<string, { label: string; limit: number }> = {
  buildings: { label: 'Buildings', limit: 10 },
  units: { label: 'Units', limit: 50 },
  renters: { label: 'Renters', limit: 100 },
  agreements: { label: 'Agreements', limit: 200 },
  reports: { label: 'Reports', limit: 50 },
};

export const DashboardSubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({
  subscription,
  featureUsage,
  onUpgrade,
}) => {
  const theme = useTheme();
  const [daysRemaining, setDaysRemaining] = useState(() => {
    if (!subscription) return 0;
    return Math.ceil(
      (new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  });

  useEffect(() => {
    if (!subscription) return;
    const calculateDays = () => {
      const end = new Date(subscription.end_date).getTime();
      const now = Date.now();
      const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      setDaysRemaining(diff);
    };
    calculateDays();
    const interval = setInterval(calculateDays, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [subscription]);

  const getUsagePercentage = (featureKey: string) => {
    const usage = featureUsage.find((f) => f.feature_key === featureKey);
    const limitInfo = FEATURE_LIMITS[featureKey];
    if (!usage || !limitInfo) return 0;
    return Math.min(usage.usage_count / limitInfo.limit, 1);
  };

  const getUsageCount = (featureKey: string) => {
    const usage = featureUsage.find((f) => f.feature_key === featureKey);
    return usage?.usage_count || 0;
  };

  const getPlanLabel = () => {
    if (!subscription) return 'Free Plan';
    return subscription.is_yearly
      ? `${subscription.name} (Yearly)`
      : `${subscription.name} (Monthly)`;
  };

  const isNearLimit = (featureKey: string) => {
    return getUsagePercentage(featureKey) >= 0.8;
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, fontWeight: '600' }}
            >
              Subscription
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
            >
              {getPlanLabel()}
            </Text>
          </View>
          {subscription && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: subscription.is_active_subscription
                    ? `${theme.colors.primary}15`
                    : `${theme.colors.error}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: subscription.is_active_subscription
                      ? theme.colors.primary
                      : theme.colors.error,
                  },
                ]}
              >
                {subscription.is_active_subscription ? 'Active' : 'Inactive'}
              </Text>
            </View>
          )}
        </View>

        {subscription && (
          <View style={[styles.renewalInfo, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
            </Text>
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '500', marginBottom: 12 }}
          >
            Feature Usage
          </Text>
          {Object.entries(FEATURE_LIMITS).map(([key, info]) => {
            const percentage = getUsagePercentage(key);
            const count = getUsageCount(key);
            return (
              <View key={key} style={styles.featureItem}>
                <View style={styles.featureHeader}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {info.label}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurface, fontWeight: '500' }}
                  >
                    {count} / {info.limit}
                  </Text>
                </View>
                <ProgressBar
                  progress={percentage}
                  color={isNearLimit(key) ? theme.colors.error : theme.colors.primary}
                  style={styles.progressBar}
                />
              </View>
            );
          })}
        </View>

        {!subscription?.is_active_subscription && (
          <Button
            mode="contained"
            onPress={onUpgrade}
            style={[styles.upgradeButton, { backgroundColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.onPrimary, fontWeight: '600' }}
          >
            Upgrade Plan
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  renewalInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  featuresSection: {
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
