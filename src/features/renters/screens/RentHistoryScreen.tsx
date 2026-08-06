import { Spacing } from '@/constants/theme';
import { useRenterPayments } from '@/features/renters/hooks/useRenterPayments';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function RentHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { payments, isLoading } = useRenterPayments(Number(id));

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Rent History</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : payments && payments.length > 0 ? (
          payments.map((record) => (
            <View key={record.id} style={styles.item}>
              <Text style={styles.month}>{new Date(record.due_date).toLocaleDateString()}</Text>
              <Text style={styles.amount}>₹{record.amount}</Text>
              <Text
                style={[styles.status, { color: record.status === 'PAID' ? '#16a34a' : '#d97706' }]}
              >
                {record.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No rent history found.</Text>
        )}
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: '#6b7280',
  },
  item: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 14,
    color: '#374151',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
