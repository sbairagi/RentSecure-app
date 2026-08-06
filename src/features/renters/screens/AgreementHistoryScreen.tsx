import { Spacing } from '@/constants/theme';
import { AgreementCard } from '@/features/renters/components/AgreementCard';
import { useRenterAgreements } from '@/features/renters/hooks/useRenterAgreements';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function AgreementHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreements, isLoading } = useRenterAgreements(Number(id));

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Agreement History</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : agreements && agreements.length > 0 ? (
          agreements.map((agreement) => <AgreementCard key={agreement.id} agreement={agreement} />)
        ) : (
          <Text style={styles.emptyText}>No agreements found.</Text>
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
