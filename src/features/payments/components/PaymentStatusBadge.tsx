import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { PaymentStatusConfig } from '../types/payments';
import { PAYMENT_CONSTANTS } from '../constants/payments';

interface PaymentStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const theme = useTheme();
  const config: PaymentStatusConfig = PAYMENT_CONSTANTS.STATUS_CONFIG[status as keyof typeof PAYMENT_CONSTANTS.STATUS_CONFIG] || PAYMENT_CONSTANTS.STATUS_CONFIG.pending;
  const label = PAYMENT_CONSTANTS.STATUS_LABELS[status as keyof typeof PAYMENT_CONSTANTS.STATUS_LABELS] || status;

  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 11 },
    medium: { paddingHorizontal: 12, paddingVertical: 4, fontSize: 12 },
    large: { paddingHorizontal: 16, paddingVertical: 6, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        },
      ]}
    >
      <Text style={[styles.text, { color: config.color, fontSize: sizeStyles[size].fontSize }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
