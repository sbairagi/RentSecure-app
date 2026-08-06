import { Spacing } from '@/constants/theme';
import { RenterInfoSection } from '@/features/renters/components/RenterInfoSection';
import { useRenterProfile } from '@/features/renters/hooks/useRenterProfile';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function RenterProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, isLoading } = useRenterProfile(Number(id));

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text>Loading...</Text>
        </View>
      </RouteGuard>
    );
  }

  if (!profile) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text style={styles.emptyText}>Profile not found.</Text>
        </View>
      </RouteGuard>
    );
  }

  const data = [
    { label: 'Name', value: profile.name || 'N/A' },
    { label: 'Email', value: profile.email || 'N/A' },
    { label: 'Phone', value: profile.phone || 'N/A' },
    { label: 'Alternate Phone', value: profile.alternate_phone || 'N/A' },
    { label: 'Emergency Contact', value: profile.emergency_contact_name || 'N/A' },
    { label: 'Emergency Number', value: profile.emergency_contact_number || 'N/A' },
    { label: 'WhatsApp', value: profile.whatsapp_number || 'N/A' },
    { label: 'Rent Amount', value: profile.rent_amount ? `₹${profile.rent_amount}` : 'N/A' },
    {
      label: 'Start Date',
      value: profile.start_date ? new Date(profile.start_date).toLocaleDateString() : 'N/A',
    },
    {
      label: 'End Date',
      value: profile.end_date ? new Date(profile.end_date).toLocaleDateString() : 'N/A',
    },
    { label: 'Status', value: profile.status || 'N/A' },
    { label: 'Onboarding Status', value: profile.onboarding_status || 'N/A' },
    { label: 'KYC Status', value: profile.kyc_status || 'N/A' },
    { label: 'Notes', value: profile.notes || 'N/A' },
  ];

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Renter Profile</Title>
        <RenterInfoSection title="Profile Information" data={data} />
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
