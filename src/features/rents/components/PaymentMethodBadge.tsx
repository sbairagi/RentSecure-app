import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { RentPaymentMethod } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';

interface PaymentMethodBadgeProps {
  method: RentPaymentMethod;
  size?: 'small' | 'medium';
}

export const PaymentMethodBadge: React.FC<PaymentMethodBadgeProps> = ({ method, size = 'medium' }) => {
  const theme = useTheme();
  const config = RENT_CONSTANTS.METHOD_CONFIG[method] || RENT_CONSTANTS.METHOD_CONFIG.other;

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: config.color + '15',
        paddingHorizontal: size === 'small' ? 8 : 12,
        paddingVertical: size === 'small' ? 2 : 4,
      },
    ]}>
      <Text style={[
        styles.text,
        {
          color: config.color,
          fontSize: size === 'small' ? 11 : 12,
        },
      ]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
