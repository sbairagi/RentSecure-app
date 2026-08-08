import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, useTheme, Divider, Card } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useAddOns } from '../hooks';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency } from '../utils/formatting';

export default function AddOnDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: addOns, isLoading } = useAddOns();
  const addOn = addOns?.find(a => String(a.id) === id);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading add-on details...</Text>
      </View>
    );
  }

  if (!addOn) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <EmptyState
            title="Add-on Not Found"
            description="The selected add-on could not be found."
            actionLabel="Back to Add-ons"
            onAction={() => router.back()}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              {addOn.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(addOn.amount)}
            </Text>
          </View>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Details</Text>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Feature</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {addOn.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Amount</Text>
                <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
                  {formatCurrency(addOn.amount)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Type</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {addOn.is_recurring ? 'Recurring' : 'One-time'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Purchased</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {new Date(addOn.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => router.back()} style={styles.button}>
              Back to Add-ons
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
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
