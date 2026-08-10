import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { RentPaymentStatus } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';

interface RentStatusBadgeProps {
  status: RentPaymentStatus;
  size?: 'small' | 'medium';
}

export const RentStatusBadge: React.FC<RentStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const theme = useTheme();
  const config = RENT_CONSTANTS.STATUS_CONFIG[status] || RENT_CONSTANTS.STATUS_CONFIG.pending;

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: config.backgroundColor,
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
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
