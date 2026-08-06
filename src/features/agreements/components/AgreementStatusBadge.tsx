import { Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AgreementStatusBadgeProps } from '../types';

const AGREEMENT_STATUS_COLORS: Record<AgreementStatusBadgeProps['status'], string> = {
  draft: '#6b7280',
  pending_signature: '#d97706',
  partially_signed: '#2563eb',
  fully_signed: '#059669',
  active: '#16a34a',
  expired: '#dc2626',
  terminated: '#991b1b',
  cancelled: '#6b7280',
};

const AGREEMENT_STATUS_LABELS: Record<AgreementStatusBadgeProps['status'], string> = {
  draft: 'Draft',
  pending_signature: 'Pending Signature',
  partially_signed: 'Partially Signed',
  fully_signed: 'Fully Signed',
  active: 'Active',
  expired: 'Expired',
  terminated: 'Terminated',
  cancelled: 'Cancelled',
};

export const AgreementStatusBadge: React.FC<AgreementStatusBadgeProps> = ({ status }) => {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Status: ${AGREEMENT_STATUS_LABELS[status]}`}
      style={[
        styles.badge,
        { backgroundColor: AGREEMENT_STATUS_COLORS[status] + '20' },
      ]}
    >
      <Text style={[styles.text, { color: AGREEMENT_STATUS_COLORS[status] }]}>
        {AGREEMENT_STATUS_LABELS[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
