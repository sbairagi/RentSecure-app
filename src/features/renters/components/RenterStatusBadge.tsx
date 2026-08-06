import { Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RenterStatusBadgeProps } from '../types';

const RENTER_STATUS_COLORS: Record<RenterStatusBadgeProps['status'], string> = {
  active: '#16a34a',
  notice_period: '#d97706',
  revoked: '#dc2626',
  deactivated: '#6b7280',
};

const RENTER_STATUS_LABELS: Record<RenterStatusBadgeProps['status'], string> = {
  active: 'Active',
  notice_period: 'Notice Period',
  revoked: 'Revoked',
  deactivated: 'Deactivated',
};

export const RenterStatusBadge: React.FC<RenterStatusBadgeProps> = ({ status }) => {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Status: ${RENTER_STATUS_LABELS[status]}`}
      style={[styles.badge, { backgroundColor: RENTER_STATUS_COLORS[status] + '20' }]}
    >
      <Text style={[styles.text, { color: RENTER_STATUS_COLORS[status] }]}>
        {RENTER_STATUS_LABELS[status]}
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
