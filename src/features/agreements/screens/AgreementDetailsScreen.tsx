import { Spacing } from '@/constants/theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AgreementCard } from '../components/AgreementCard';
import { useAgreement } from '../hooks/useAgreement';

export default function AgreementDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreement, isLoading, error, refresh } = useAgreement(Number(id));

  const handleEdit = () => {
    router.push(`/(drawer)/(tabs)/agreements/${id}/edit`);
  };

  const handleDelete = () => {
    router.push(`/(drawer)/(tabs)/agreements/${id}/delete`);
  };

  const handleSign = () => {
    router.push(`/(drawer)/(tabs)/agreements/${id}/sign`);
  };

  const handleGeneratePDF = () => {
    router.push(`/(drawer)/(tabs)/agreements/${id}/pdf`);
  };

  const navigateToSection = (screen: string) => {
    router.push(`/(drawer)/(tabs)/agreements/${id}/${screen}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.loadingText}>Loading agreement details...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !agreement) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.errorText}>{error || 'Agreement not found'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const renterData = [
    { label: 'Renter', value: agreement.renter_name || `#${agreement.renter}` },
    { label: 'Phone', value: agreement.renter_phone || 'N/A' },
  ];

  const unitData = [
    { label: 'Unit', value: agreement.unit_name || `#${agreement.unit}` },
    { label: 'Building', value: agreement.building_name || 'N/A' },
  ];

  const agreementData = [
    { label: 'Start Date', value: new Date(agreement.agreement_start_date).toLocaleDateString() },
    { label: 'End Date', value: new Date(agreement.agreement_end_date).toLocaleDateString() },
    { label: 'Rent Amount', value: `₹${agreement.rent_amount}` },
    { label: 'Security Deposit', value: `₹${agreement.security_deposit}` },
    {
      label: 'Owner Signed',
      value: agreement.owner_signed ? 'Yes' : 'No',
    },
    {
      label: 'Renter Signed',
      value: agreement.renter_signed ? 'Yes' : 'No',
    },
  ];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:read']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#111827' }]}>
              Agreement #{agreement.id}
            </Text>
            <View style={styles.headerActions}>
              {!agreement.owner_signed && !agreement.renter_signed && (
                <TouchableOpacity onPress={handleSign} style={styles.headerButton}>
                  <Text style={styles.headerButtonText}>Sign</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleGeneratePDF} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, { color: '#dc2626' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigateToSection('timeline')}>
            <View style={[styles.section, { backgroundColor: '#fff' }]}>
              <Text style={styles.sectionTitle}>Renter</Text>
              {renterData.map((item) => (
                <View key={item.label} style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{item.label}:</Text>
                  <Text style={styles.dataValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToSection('documents')}>
            <View style={[styles.section, { backgroundColor: '#fff' }]}>
              <Text style={styles.sectionTitle}>Unit</Text>
              {unitData.map((item) => (
                <View key={item.label} style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{item.label}:</Text>
                  <Text style={styles.dataValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToSection('documents')}>
            <View style={[styles.section, { backgroundColor: '#fff' }]}>
              <Text style={styles.sectionTitle}>Agreement Details</Text>
              {agreementData.map((item) => (
                <View key={item.label} style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{item.label}:</Text>
                  <Text style={styles.dataValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          <View style={styles.sectionLinks}>
            {[
              { screen: 'timeline', label: 'Timeline' },
              { screen: 'documents', label: 'Documents' },
              { screen: 'witnesses', label: 'Witnesses' },
              { screen: 'versions', label: 'Versions' },
              { screen: 'history', label: 'History' },
            ].map((link) => (
              <TouchableOpacity
                key={link.screen}
                style={styles.sectionLink}
                onPress={() => navigateToSection(link.screen)}
              >
                <Text style={styles.sectionLinkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  sectionLinks: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sectionLink: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
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
});
