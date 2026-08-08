import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Divider,
  Card,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useAddOns, useEffectiveLimits, useSubscriptionPlans } from '../hooks';
import { AddOnCard } from '../components/AddOnCard';
import { EmptyState } from '../components/EmptyState';
import { FEATURE_LABELS } from '../types/limits';
import { subscriptionService } from '../services/subscriptionService';

export default function AddOnsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: addOns, isLoading: addOnsLoading } = useAddOns();
  const { data: effectiveLimits, isLoading: limitsLoading } = useEffectiveLimits();
  const { data: plans } = useSubscriptionPlans();

  const currentPlanName = subscriptionService.getStatus(null).planName;
  const currentPlan = plans?.find(p => p.name === currentPlanName);

  const numericFeatures = effectiveLimits?.filter(l => 
    !['tax_notifications', 'whatsapp_alerts', 'rent_agreement_drafting', 'export_pdf_dossier'].includes(l.featureKey as string)
  ) ?? [];

  const isLoading = addOnsLoading || limitsLoading;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading add-ons...</Text>
      </View>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Add-ons
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Extend your plan with additional capacity
            </Text>
          </View>

          {currentPlan && (
            <View style={styles.currentPlanInfo}>
              <Text style={[styles.currentPlanText, { color: theme.colors.onSurfaceVariant }]}>
                Current plan: <Text style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                  {currentPlan.name.charAt(0).toUpperCase() + currentPlan.name.slice(1)}
                </Text>
              </Text>
            </View>
          )}

          {numericFeatures.length > 0 && (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Feature Usage & Limits
                </Text>
                <Divider style={styles.divider} />
                {numericFeatures.map(limit => (
                  <View key={limit.featureKey} style={styles.featureRow}>
                    <Text style={[styles.featureLabel, { color: theme.colors.onSurface }]}>
                       {(FEATURE_LABELS as Record<string, string>)[limit.featureKey] || limit.featureKey.replace(/_/g, ' ')}
                    </Text>
                    <Text style={[styles.featureUsage, { color: theme.colors.onSurfaceVariant }]}>
                      {limit.currentUsage} / {limit.effectiveLimit === 'unlimited' ? '∞' : limit.effectiveLimit}
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Available Add-ons
              </Text>
              <Divider style={styles.divider} />
              {addOns && addOns.length > 0 ? (
                addOns.map(addOn => (
                  <AddOnCard key={addOn.id} addOn={addOn} />
                ))
              ) : (
                <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', padding: 16 }}>
                  No add-ons purchased yet.
                </Text>
              )}
            </Card.Content>
          </Card>

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/plans')} style={styles.button}>
              Browse Plans
            </Button>
            <Button mode="outlined" onPress={() => router.push('/(drawer)/(tabs)/subscription/usage')} style={styles.button}>
              View Usage
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
  currentPlanInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  currentPlanText: {
    fontSize: 14,
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
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  featureLabel: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  featureUsage: {
    fontSize: 14,
    fontWeight: '500',
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
