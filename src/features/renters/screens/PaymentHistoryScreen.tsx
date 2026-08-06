import { Spacing } from '@/constants/theme';
import { RentRecordCard } from '@/features/renters/components/RentRecordCard';
import { useRenterPayments } from '@/features/renters/hooks/useRenterPayments';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function PaymentHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { payments, isLoading } = useRenterPayments(Number(id));

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Payment History</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : payments && payments.length > 0 ? (
          payments.map((record) => <RentRecordCard key={record.id} record={record} />)
        ) : (
          <Text style={styles.emptyText}>No payment history found.</Text>
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
});
