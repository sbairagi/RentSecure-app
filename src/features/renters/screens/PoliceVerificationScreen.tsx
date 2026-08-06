import { Spacing } from '@/constants/theme';
import { PoliceVerificationCard } from '@/features/renters/components/PoliceVerificationCard';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function PoliceVerificationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter, isLoading } = useRenter(Number(id));
  const verification = renter as any;

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Police Verification</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : verification ? (
          <PoliceVerificationCard
            verification={verification}
            onUpload={() => {}}
            onDownload={() => {}}
          />
        ) : (
          <Text style={styles.emptyText}>No police verification record found.</Text>
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
