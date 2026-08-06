import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AgreementCardProps } from '../types';

const AGREEMENT_STATUS_COLORS: Record<string, string> = {
  draft: '#6b7280',
  pending_signature: '#d97706',
  partially_signed: '#2563eb',
  fully_signed: '#059669',
  active: '#16a34a',
  expired: '#dc2626',
  terminated: '#991b1b',
  cancelled: '#6b7280',
};

const AGREEMENT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_signature: 'Pending Signature',
  partially_signed: 'Partially Signed',
  fully_signed: 'Fully Signed',
  active: 'Active',
  expired: 'Expired',
  terminated: 'Terminated',
  cancelled: 'Cancelled',
};

export const AgreementCard: React.FC<AgreementCardProps> = ({
  agreement,
  onPress,
  onEdit,
  onDelete,
  onSign,
  onGeneratePDF,
}) => {
  const theme = useTheme();
  const status = agreement.status || 'draft';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${AGREEMENT_STATUS_LABELS[status]} agreement for ${agreement.renter_name || `Renter ${agreement.renter}`}`}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>
              {agreement.renter_name || `Renter #${agreement.renter}`}
            </Text>
            <Text style={[styles.unit, { color: theme.subText }]}>
              {agreement.unit_name
                ? `${agreement.unit_name}${agreement.building_name ? ` - ${agreement.building_name}` : ''}`
                : `Unit #${agreement.unit}`}
            </Text>
          </View>
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Status: ${AGREEMENT_STATUS_LABELS[status]}`}
            style={[
              styles.badge,
              { backgroundColor: AGREEMENT_STATUS_COLORS[status] + '20' },
            ]}
          >
            <Text
              style={[styles.badgeText, { color: AGREEMENT_STATUS_COLORS[status] }]}
            >
              {AGREEMENT_STATUS_LABELS[status]}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Rent:</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            ₹{agreement.rent_amount}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Period:</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {new Date(agreement.agreement_start_date).toLocaleDateString()} -{' '}
            {new Date(agreement.agreement_end_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Signed:</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {agreement.owner_signed && agreement.renter_signed
              ? 'Fully'
              : agreement.owner_signed || agreement.renter_signed
                ? 'Partially'
                : 'None'}
          </Text>
        </View>
      </View>
      {(onEdit || onDelete || onSign || onGeneratePDF) && (
        <View style={[styles.actions, { borderTopColor: theme.border }]}>
          {onSign && !agreement.owner_signed && !agreement.renter_signed && (
            <TouchableOpacity
              onPress={onSign}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Send for signature"
              style={[styles.actionButton, { backgroundColor: '#2563eb' }]}
            >
              <Text style={styles.actionButtonText}>Sign</Text>
            </TouchableOpacity>
          )}
          {onGeneratePDF && (
            <TouchableOpacity
              onPress={onGeneratePDF}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Generate PDF"
              style={[styles.actionButton, { backgroundColor: '#16a34a' }]}
            >
              <Text style={styles.actionButtonText}>PDF</Text>
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Edit agreement"
              style={[styles.actionButton, { backgroundColor: '#d97706' }]}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Delete agreement"
              style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
            >
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  unit: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  actions: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default memo(AgreementCard);
