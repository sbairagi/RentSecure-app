import { Spacing } from '@/constants/theme';
import { RenterInfoSection } from '@/features/renters/components/RenterInfoSection';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function EmergencyContactsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter, isLoading } = useRenter(Number(id));

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text>Loading...</Text>
        </View>
      </RouteGuard>
    );
  }

  if (!renter) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text style={styles.emptyText}>Renter not found</Text>
        </View>
      </RouteGuard>
    );
  }

  const data = [
    { label: 'Name', value: renter.emergency_contact_name || 'N/A' },
    { label: 'Number', value: renter.emergency_contact_number || 'N/A' },
  ];

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Emergency Contacts</Title>
        <RenterInfoSection title="Contact" data={data} />
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
