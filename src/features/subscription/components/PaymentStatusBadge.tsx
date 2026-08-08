import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, useTheme, Text } from 'react-native-paper';
import type { PaymentStatus } from '../types/payment';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; backgroundColor: string }> = {
  created: { label: 'Created', color: '#6B7280', backgroundColor: '#F3F4F6' },
  pending: { label: 'Pending', color: '#D97706', backgroundColor: '#FEF3C7' },
  processing: { label: 'Processing', color: '#2563EB', backgroundColor: '#DBEAFE' },
  success: { label: 'Success', color: '#059669', backgroundColor: '#D1FAE5' },
  failed: { label: 'Failed', color: '#DC2626', backgroundColor: '#FEE2E2' },
  cancelled: { label: 'Cancelled', color: '#6B7280', backgroundColor: '#F3F4F6' },
  refunded: { label: 'Refunded', color: '#7C3AED', backgroundColor: '#EDE9FE' },
  expired: { label: 'Expired', color: '#DC2626', backgroundColor: '#FEE2E2' },
};

export function PaymentStatusBadge({ status, size = 'medium' }: PaymentStatusBadgeProps) {
  const theme = useTheme();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.created;

  if (size === 'small') {
    return (
      <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
        <Text style={[styles.smallText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  }

  return (
    <Chip 
      mode="flat" 
      style={{ backgroundColor: config.backgroundColor }}
      textStyle={{ color: config.color }}
    >
      {config.label}
    </Chip>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  smallText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
