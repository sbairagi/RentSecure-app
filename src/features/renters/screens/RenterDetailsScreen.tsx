import { Spacing } from '@/constants/theme';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Button, Title, useTheme } from 'react-native-paper';
import { RENTER_CONSTANTS } from '../constants/renters';

export default function RenterDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter, isLoading, error, refresh, updateStatus, isUpdatingStatus, vacate, isVacating, assignUnit, isAssigningUnit, deleteRenter, isDeleting } = useRenter(Number(id));
  const theme = useTheme();
  
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
  
  const handleStartNoticePeriod = async () => {
    await updateStatus(RENTER_CONSTANTS.STATUS.NOTICE_PERIOD);
  };
  
  const handleRevoke = async () => {
    await updateStatus(RENTER_CONSTANTS.STATUS.REVOKED);
  };
  
  const handleDeactivate = async () => {
    await updateStatus(RENTER_CONSTANTS.STATUS.DEACTIVATED);
  };
  
  const handleReactivate = async () => {
    await updateStatus(RENTER_CONSTANTS.STATUS.ACTIVE);
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
  
  const statusColor = RENTER_CONSTANTS.STATUS_CONFIG[renter.status]?.color || '#374151';
  const statusBg = RENTER_CONSTANTS.STATUS_CONFIG[renter.status]?.backgroundColor || '#f3f4f6';
  const statusLabel = RENTER_CONSTANTS.STATUS_LABELS[renter.status] || renter.status;
  const isActive = renter.status === RENTER_CONSTANTS.STATUS.ACTIVE;
  const isNoticePeriod = renter.status === RENTER_CONSTANTS.STATUS.NOTICE_PERIOD;
  const isRevoked = renter.status === RENTER_CONSTANTS.STATUS.REVOKED;
  const isDeactivated = renter.status === RENTER_CONSTANTS.STATUS.DEACTIVATED;
  
  const profileData = [
    { label: 'Name', value: renter.name },
    { label: 'Email', value: renter.email || 'N/A' },
    { label: 'Phone', value: renter.phone },
    { label: 'Alternate Phone', value: renter.alternate_phone || 'N/A' },
    { label: 'Emergency Contact', value: renter.emergency_contact_name || 'N/A' },
    { label: 'Emergency Number', value: renter.emergency_contact_number || 'N/A' },
    { label: 'WhatsApp', value: renter.whatsapp_number || 'N/A' },
  ];
  
  const agreementData = [
    { label: 'Start Date', value: new Date(renter.start_date).toLocaleDateString() },
    {
      label: 'End Date',
      value: renter.end_date ? new Date(renter.end_date).toLocaleDateString() : 'N/A',
    },
    { label: 'Rent Amount', value: `₹${renter.rent_amount}` },
    { label: 'Rent Due Date', value: renter.rent_due_date ? new Date(renter.rent_due_date).toLocaleDateString() : 'N/A' },
  ];
  
  const statusData = [
    { label: 'Status', value: statusLabel },
    { label: 'Notice Start', value: renter.notice_start_date ? new Date(renter.notice_start_date).toLocaleDateString() : 'N/A' },
    { label: 'Vacated On', value: renter.vacated_on ? new Date(renter.vacated_on).toLocaleDateString() : 'N/A' },
    { label: 'Late Payments', value: String(renter.late_payment_count) },
    { label: 'Missed Rents', value: String(renter.missed_rents) },
  ];
  
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:read']}>
        <ScrollView style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
            <Title style={styles.headerTitle}>{renter.name}</Title>
             <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
               <Text style={[styles.statusText, { color: statusColor }]}>
                 {statusLabel}
               </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            {isActive && (
              <>
                <Button mode="contained" onPress={handleEdit} style={styles.actionButton}>
                  Edit
                </Button>
                <Button mode="outlined" onPress={handleAssignUnit} style={styles.actionButton} loading={isAssigningUnit}>
                  Assign Unit
                </Button>
                <Button mode="outlined" onPress={handleStartNoticePeriod} style={styles.actionButton} loading={isUpdatingStatus}>
                  Start Notice Period
                </Button>
                <Button mode="outlined" onPress={handleRevoke} style={styles.actionButton} loading={isUpdatingStatus}>
                  Revoke
                </Button>
                <Button mode="outlined" onPress={handleDeactivate} style={styles.actionButton} loading={isUpdatingStatus}>
                  Deactivate
                </Button>
              </>
            )}
            {isNoticePeriod && (
              <>
                <Button mode="outlined" onPress={handleReactivate} style={styles.actionButton} loading={isUpdatingStatus}>
                  Cancel Notice
                </Button>
                <Button mode="outlined" onPress={handleVacate} style={styles.actionButton} loading={isVacating}>
                  Complete Move-out
                </Button>
              </>
            )}
            {(isRevoked || isDeactivated) && (
              <Button mode="outlined" onPress={handleReactivate} style={styles.actionButton} loading={isUpdatingStatus}>
                Reactivate
              </Button>
            )}
            <Button mode="text" onPress={handleDelete} textColor="#dc2626">
              Delete Renter
            </Button>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            {profileData.map((item, index) => (
              <View key={index} style={[styles.dataRow, { borderBottomColor: '#e5e7eb' }]}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agreement</Text>
            {agreementData.map((item, index) => (
              <View key={index} style={[styles.dataRow, { borderBottomColor: '#e5e7eb' }]}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            {statusData.map((item, index) => (
              <View key={index} style={[styles.dataRow, { borderBottomColor: '#e5e7eb' }]}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          
          {renter.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{renter.notes}</Text>
            </View>
          )}
          
          <View style={styles.sectionLinks}>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('payments')}>
              <Text style={styles.sectionLinkText}>Payments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('documents')}>
              <Text style={styles.sectionLinkText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('agreements')}>
              <Text style={styles.sectionLinkText}>Agreements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('kyc')}>
              <Text style={styles.sectionLinkText}>KYC Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('timeline')}>
              <Text style={styles.sectionLinkText}>Timeline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('notes')}>
              <Text style={styles.sectionLinkText}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink} onPress={() => navigateToSection('notifications')}>
              <Text style={styles.sectionLinkText}>Notifications</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  section: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: '#111827',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sectionLinks: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
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
  bottomPadding: {
    height: Spacing.xl,
  },
});