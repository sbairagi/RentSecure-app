import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import type { SubscriptionPlan } from '../types';
import { getPlanDisplayName, formatCurrency } from '../utils/formatting';
import { useTranslation } from 'react-i18next';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  billingCycle: 'monthly' | 'yearly';
  onPress?: () => void;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
  disabled?: boolean;
}

export function PlanCard({ plan, isCurrentPlan, billingCycle, onPress, onUpgrade, onDowngrade, disabled }: PlanCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const price = billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price;
  const features = plan.features.split(',').map((f: string) => f.trim()).filter(Boolean);

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        isCurrentPlan && { borderColor: theme.colors.primary, borderWidth: 2 },
      ]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <Text style={[styles.planName, { color: theme.colors.onSurface }]}>
            {getPlanDisplayName(plan.name)}
          </Text>
          {isCurrentPlan && (
            <Chip mode="flat" style={{ backgroundColor: theme.colors.primaryContainer }}>
              Current Plan
            </Chip>
          )}
        </View>

        <Text style={[styles.price, { color: theme.colors.primary }]}>
          {formatCurrency(price)}/{billingCycle === 'monthly' ? 'mo' : 'yr'}
        </Text>

        {features.length > 0 && (
          <View style={styles.featuresContainer}>
            {features.slice(0, 4).map((feature: string, index: number) => (
              <Text key={index} style={[styles.feature, { color: theme.colors.onSurfaceVariant }]}>
                • {feature}
              </Text>
            ))}
            {features.length > 4 && (
              <Text style={[styles.moreFeatures, { color: theme.colors.onSurfaceVariant }]}>
                +{features.length - 4} more
              </Text>
            )}
          </View>
        )}

        {!isCurrentPlan && (
          <View style={styles.actions}>
            {onUpgrade && (
              <Button mode="contained" onPress={onUpgrade} disabled={disabled} style={styles.button}>
                Upgrade
              </Button>
            )}
            {onDowngrade && (
              <Button mode="outlined" onPress={onDowngrade} disabled={disabled} style={styles.button}>
                Downgrade
              </Button>
            )}
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
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    marginBottom: 4,
  },
  moreFeatures: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
