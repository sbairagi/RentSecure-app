import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, ProgressBar, Text, useTheme } from 'react-native-paper';

import type { FeatureUsage, PlanLimit, SubscriptionPlan } from '../types/dashboard';

interface SubscriptionWidgetProps {
  subscription: SubscriptionPlan | null;
  featureUsage: FeatureUsage[];
  planLimits: PlanLimit[];
  onUpgrade: () => void;
}

const DEFAULT_FEATURE_LIMITS: Record<string, { label: string; limit: number }> = {
  max_buildings: { label: 'Buildings', limit: 10 },
  max_units: { label: 'Units', limit: 50 },
  max_renters: { label: 'Renters', limit: 100 },
  max_caretakers: { label: 'Caretakers', limit: 50 },
  max_unit_images: { label: 'Unit Images', limit: 100 },
  max_document_uploads: { label: 'Documents', limit: 50 },
  tax_notifications: { label: 'Tax Notifications', limit: 12 },
  whatsapp_alerts: { label: 'WhatsApp Alerts', limit: 100 },
  rent_agreement_drafting: { label: 'Agreements', limit: 20 },
  export_pdf_dossier: { label: 'PDF Exports', limit: 10 },
};

const FEATURE_LABELS: Record<string, string> = {
  max_buildings: 'Buildings',
  max_units: 'Units',
  max_renters: 'Renters',
  max_caretakers: 'Caretakers',
  max_unit_images: 'Unit Images',
  max_document_uploads: 'Documents',
  tax_notifications: 'Tax Notifications',
  whatsapp_alerts: 'WhatsApp Alerts',
  rent_agreement_drafting: 'Agreements',
  export_pdf_dossier: 'PDF Exports',
};

export const DashboardSubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({
  subscription,
  featureUsage,
  planLimits,
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

  const getLimit = (featureKey: string): number | undefined => {
    const fromPlan = planLimits.find((l) => l.feature_key === featureKey);
    if (fromPlan) {
      const parsed = parseInt(fromPlan.value, 10);
      if (!Number.isNaN(parsed)) return parsed;
      if (fromPlan.value.toLowerCase() === 'unlimited') return Infinity;
      return undefined;
    }
    const fallback = DEFAULT_FEATURE_LIMITS[featureKey];
    return fallback?.limit;
  };

  const getUsagePercentage = (featureKey: string) => {
    const usage = featureUsage.find((f) => f.feature_key === featureKey);
    const limit = getLimit(featureKey);
    if (!usage || limit === undefined) return 0;
    if (limit === Infinity) return 0;
    return Math.min(usage.usage_count / limit, 1);
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
    const limit = getLimit(featureKey);
    const usage = featureUsage.find((f) => f.feature_key === featureKey);
    if (!usage || limit === undefined || limit === Infinity) return false;
    return usage.usage_count / limit >= 0.8;
  };

  const displayFeatures = Object.keys(FEATURE_LABELS);

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
              {subscription.is_subscription_expired
                ? 'Expired'
                : daysRemaining > 0
                  ? `${daysRemaining} days remaining`
                  : 'Expired'}
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
          {displayFeatures.map((key) => {
            const limit = getLimit(key);
            if (limit === undefined) return null;
            const percentage = getUsagePercentage(key);
            const count = getUsageCount(key);
            const nearLimit = isNearLimit(key);
            return (
              <View key={key} style={styles.featureItem}>
                <View style={styles.featureHeader}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {FEATURE_LABELS[key]}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurface, fontWeight: '500' }}
                  >
                    {limit === Infinity ? `${count} / ∞` : `${count} / ${limit}`}
                  </Text>
                </View>
                {limit !== Infinity && (
                  <ProgressBar
                    progress={percentage}
                    color={nearLimit ? theme.colors.error : theme.colors.primary}
                    style={styles.progressBar}
                  />
                )}
              </View>
            );
          })}
        </View>

        {subscription && !subscription.is_active_subscription && (
          <Button
            mode="contained"
            onPress={onUpgrade}
            style={[styles.upgradeButton, { backgroundColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.onPrimary, fontWeight: '600' }}
          >
            {subscription.is_subscription_expired ? 'Renew Plan' : 'Upgrade Plan'}
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
