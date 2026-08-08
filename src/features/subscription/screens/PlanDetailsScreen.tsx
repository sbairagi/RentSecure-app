import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Divider,
  Card,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useSubscriptionPlans } from '../hooks';
import { EmptyState } from '../components/EmptyState';
import { getPlanDisplayName, formatCurrency } from '../utils/formatting';

export default function PlanDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const plan = plans?.find(p => String(p.id) === id);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading plan details...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <EmptyState
            title="Plan Not Found"
            description="The selected plan could not be found."
            actionLabel="Back to Plans"
            onAction={() => router.back()}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const features = plan.features.split(',').map(f => f.trim()).filter(Boolean);

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.planName, { color: theme.colors.onSurface }]}>
              {getPlanDisplayName(plan.name)}
            </Text>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(plan.monthly_price)}/mo
            </Text>
            <Text style={[styles.yearlyPrice, { color: theme.colors.onSurfaceVariant }]}>
              or {formatCurrency(plan.yearly_price)}/yr (save ~17%)
            </Text>
          </View>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Plan Features
              </Text>
              <Divider style={styles.divider} />
              {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={[styles.featureBullet, { color: theme.colors.primary }]}>✓</Text>
                  <Text style={[styles.featureText, { color: theme.colors.onSurface }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/upgrade')} style={styles.button}>
              Select This Plan
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
    alignItems: 'center',
  },
  planName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
  },
  yearlyPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  featureBullet: {
    fontSize: 18,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  button: {
    alignSelf: 'center',
    minWidth: 200,
  },
});
