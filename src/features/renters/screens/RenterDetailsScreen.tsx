import { Spacing } from '@/constants/theme';
import { RenterInfoSection } from '@/features/renters/components/RenterInfoSection';
import { RenterProfileHeader } from '@/features/renters/components/RenterProfileHeader';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRenter } from '../hooks/useRenter';

export default function RenterDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter, isLoading, error, refresh, vacate } = useRenter(Number(id));

  const handleEdit = () => {
    router.push(`/(drawer)/(tabs)/renters/${id}/edit`);
  };

  const handleDelete = () => {
    router.push(`/(drawer)/(tabs)/renters/${id}/delete`);
  };

  const handleVacate = async () => {
    await vacate();
    router.back();
  };

  const handleAssignUnit = () => {
    router.push(`/(drawer)/(tabs)/renters/${id}/assign-unit`);
  };

  const handleTransferUnit = () => {
    router.push(`/(drawer)/(tabs)/renters/${id}/transfer-unit`);
  };

  const navigateToSection = (screen: string) => {
    router.push(`/(drawer)/(tabs)/renters/${id}/${screen}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.loadingText}>Loading renter details...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !renter) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.errorText}>{error || 'Renter not found'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const profileData = [
    { label: 'Name', value: renter.name },
    { label: 'Email', value: renter.email || 'N/A' },
    { label: 'Phone', value: renter.phone },
    { label: 'Emergency Contact', value: renter.emergency_contact_name || 'N/A' },
    { label: 'Emergency Number', value: renter.emergency_contact_number || 'N/A' },
  ];

  const unitData = [
    {
      label: 'Unit',
      value: renter.unit_name || (renter.current_unit ? `#${renter.current_unit}` : 'Not assigned'),
    },
    { label: 'Building', value: renter.building_name || 'N/A' },
    {
      label: 'Address',
      value:
        [renter.address_line, renter.city, renter.state, renter.country, renter.postal_code]
          .filter(Boolean)
          .join(', ') || 'N/A',
    },
  ];

  const agreementData = [
    { label: 'Start Date', value: new Date(renter.start_date).toLocaleDateString() },
    {
      label: 'End Date',
      value: renter.end_date ? new Date(renter.end_date).toLocaleDateString() : 'N/A',
    },
    { label: 'Rent Amount', value: `₹${renter.rent_amount}` },
  ];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:read']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <RenterProfileHeader
            renter={renter}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onVacate={handleVacate}
            onAssignUnit={handleAssignUnit}
            onTransferUnit={handleTransferUnit}
          />

          <TouchableOpacity onPress={() => navigateToSection('profile')}>
            <RenterInfoSection title="Profile" data={profileData} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToSection('documents')}>
            <RenterInfoSection title="Current Unit" data={unitData} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToSection('agreements')}>
            <RenterInfoSection title="Agreement" data={agreementData} />
          </TouchableOpacity>

          <View style={styles.sectionLinks}>
            <TouchableOpacity
              style={styles.sectionLink}
              onPress={() => navigateToSection('payments')}
            >
              <Text style={styles.sectionLinkText}>Payments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('kyc')}>
              <Text style={styles.sectionLinkText}>KYC Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionLink}
              onPress={() => navigateToSection('police-verification')}
            >
              <Text style={styles.sectionLinkText}>Police Verification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionLink}
              onPress={() => navigateToSection('documents')}
            >
              <Text style={styles.sectionLinkText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('notes')}>
              <Text style={styles.sectionLinkText}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionLink}
              onPress={() => navigateToSection('timeline')}
            >
              <Text style={styles.sectionLinkText}>Timeline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#dc2626',
  },
  retryButton: {
    marginTop: Spacing.md,
    backgroundColor: '#4f46e5',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLinks: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  sectionLink: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  sectionLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
  },
});
