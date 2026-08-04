import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface SubscriptionCardProps {
  plan: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  status: 'active' | 'pending' | 'cancelled';
  renewalDate?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  active: { color: colors.success[500], bg: colors.success[100], label: 'Active' },
  pending: { color: colors.warning[500], bg: colors.warning[100], label: 'Pending' },
  cancelled: { color: colors.error[500], bg: colors.error[100], label: 'Cancelled' },
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  price,
  interval,
  features,
  status,
  renewalDate,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[status];

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <Text style={[styles.plan, { color: theme.colors.neutral[900] }]}>{plan}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>
      <Text style={[styles.price, { color: theme.colors.primary[600] }]}>
        ${price.toLocaleString()}
        <Text style={[styles.interval, { color: theme.colors.neutral[500] }]}>/{interval}</Text>
      </Text>
      <View style={styles.features}>
        {features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={[styles.featureBullet, { color: theme.colors.success[500] }]}>✓</Text>
            <Text style={[styles.featureText, { color: theme.colors.neutral[600] }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
      {renewalDate && (
        <Text style={[styles.renewal, { color: theme.colors.neutral[400] }]}>
          Renews: {renewalDate}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  plan: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  interval: {
    fontSize: 14,
    fontWeight: '400',
  },
  features: {
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureBullet: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: 13,
  },
  renewal: {
    fontSize: 12,
    textAlign: 'right',
  },
});
