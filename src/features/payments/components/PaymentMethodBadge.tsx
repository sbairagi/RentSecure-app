import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { PaymentMethodConfig } from '../types/payments';
import { PAYMENT_CONSTANTS } from '../constants/payments';

interface PaymentMethodBadgeProps {
  method: string;
  size?: 'small' | 'medium';
}

export const PaymentMethodBadge: React.FC<PaymentMethodBadgeProps> = ({ method, size = 'medium' }) => {
  const theme = useTheme();
  const config: PaymentMethodConfig = PAYMENT_CONSTANTS.METHOD_CONFIG[method as keyof typeof PAYMENT_CONSTANTS.METHOD_CONFIG] || PAYMENT_CONSTANTS.METHOD_CONFIG.other;
  const label = PAYMENT_CONSTANTS.METHOD_LABELS[method as keyof typeof PAYMENT_CONSTANTS.METHOD_LABELS] || method;

  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 11 },
    medium: { paddingHorizontal: 12, paddingVertical: 4, fontSize: 12 },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${config.color}15`,
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
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
