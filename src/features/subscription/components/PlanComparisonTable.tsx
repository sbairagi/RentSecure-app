import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  DataTable,
  useTheme,
} from 'react-native-paper';
import type { SubscriptionPlan } from '../types';
import { getPlanDisplayName } from '../utils/formatting';

interface PlanComparisonTableProps {
  plans: SubscriptionPlan[];
  currentPlanId?: number;
}

export function PlanComparisonTable({ plans, currentPlanId }: PlanComparisonTableProps) {
  const theme = useTheme();

  if (plans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>No plans available</Text>
      </View>
    );
  }

  const features = plans[0]?.features?.split(',').map(f => f.trim()).filter(Boolean) ?? [];

  return (
    <ScrollView horizontal style={styles.scrollContainer}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title textStyle={{ fontWeight: '700', color: theme.colors.onSurface }}>Feature</DataTable.Title>
          {plans.map(plan => (
            <DataTable.Title 
              key={plan.id} 
              textStyle={{ 
                fontWeight: '700', 
                color: plan.id === currentPlanId ? theme.colors.primary : theme.colors.onSurface,
                textAlign: 'center',
              }}
            >
              {getPlanDisplayName(plan.name)}
              {plan.id === currentPlanId ? ' ✓' : ''}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell textStyle={{ color: theme.colors.onSurface }}>Price (Monthly)</DataTable.Cell>
          {plans.map(plan => (
            <DataTable.Cell key={plan.id} textStyle={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              ₹{plan.monthly_price}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell textStyle={{ color: theme.colors.onSurface }}>Price (Yearly)</DataTable.Cell>
          {plans.map(plan => (
            <DataTable.Cell key={plan.id} textStyle={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              ₹{plan.yearly_price}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        {features.map((feature, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell textStyle={{ color: theme.colors.onSurface }}>{feature}</DataTable.Cell>
            {plans.map(plan => {
              const planFeatures = plan.features.split(',').map(f => f.trim());
              const hasFeature = planFeatures.some(f => f.toLowerCase().includes(feature.toLowerCase()));
              return (
                <DataTable.Cell key={plan.id} textStyle={{ textAlign: 'center' }}>
                  <Text style={{ color: hasFeature ? theme.colors.primary : theme.colors.error }}>
                    {hasFeature ? '✓' : '✗'}
                  </Text>
                </DataTable.Cell>
              );
            })}
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
