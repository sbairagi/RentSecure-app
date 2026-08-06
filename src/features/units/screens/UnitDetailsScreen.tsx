import { Spacing } from '@/constants/theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UnitStatusBadge } from '../components/UnitStatusBadge';
import { useUnit } from '../hooks/useUnit';
import { useUnitSubscriptionLimits } from '../hooks/useUnitSubscriptionLimits';

export default function UnitDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { unit, isLoading, error, refresh } = useUnit(Number(id));
  const { limits } = useUnitSubscriptionLimits();

  const canEdit = limits?.can_edit_unit ?? true;
  const canDelete = limits?.can_delete_unit ?? true;

  const handleAssignRenter = () => {
    router.push(`/(drawer)/(tabs)/units/${id}/assign-renter`);
  };

  const handleAssignCaretaker = () => {
    router.push(`/(drawer)/(tabs)/units/${id}/assign-caretaker`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['unit:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.loadingText}>Loading unit details...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !unit) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['unit:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.errorText}>Unit not found</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['unit:read']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <View style={[styles.header, { backgroundColor: '#fff' }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              {canEdit && (
                <TouchableOpacity onPress={() => router.push(`/(drawer)/(tabs)/units/${id}/edit`)}>
                  <Text style={[styles.headerAction, { color: '#4f46e5' }]}>Edit</Text>
                </TouchableOpacity>
              )}
              {canDelete && (
                <TouchableOpacity
                  onPress={() => router.push(`/(drawer)/(tabs)/units/${id}/delete`)}
                >
                  <Text style={[styles.headerAction, { color: '#dc2626' }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.content}>
            <View style={[styles.section, { backgroundColor: '#fff' }]}>
              <Text style={styles.sectionTitle}>Unit Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Unit Number</Text>
                <Text style={styles.value}>{unit.unit}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Building</Text>
                <Text style={styles.value}>{unit.building_name || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>{unit.unit_type.replace(/_/g, ' ')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Status</Text>
                <UnitStatusBadge status={unit.status} />
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                  {unit.address_line}, {unit.city}, {unit.state}, {unit.country}
                </Text>
              </View>
              {unit.landmark && (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Landmark</Text>
                  <Text style={styles.value}>{unit.landmark}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Postal Code</Text>
                <Text style={styles.value}>{unit.postal_code}</Text>
              </View>
            </View>

            <View style={[styles.section, { backgroundColor: '#fff' }]}>
              <Text style={styles.sectionTitle}>Renter Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Current Renter</Text>
                <Text style={styles.value}>{unit.current_renter?.name || 'Vacant'}</Text>
              </View>
              {unit.current_renter && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{unit.current_renter.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Rent Amount</Text>
                    <Text style={styles.value}>₹{unit.current_renter.rent_amount}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#dbeafe' }]}
                onPress={handleAssignRenter}
              >
                <Text style={[styles.actionButtonText, { color: '#2563eb' }]}>Assign Renter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#dcfce7' }]}
                onPress={handleAssignCaretaker}
              >
                <Text style={[styles.actionButtonText, { color: '#16a34a' }]}>
                  Assign Caretaker
                </Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerAction: {
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  section: {
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
