import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { DELIVERY_STATUS_CONFIG } from '../constants/notificationTypes';

interface DeliveryStatusBadgeProps {
  status: string;
}

export const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({ status }) => {
  const config = DELIVERY_STATUS_CONFIG[status] || DELIVERY_STATUS_CONFIG.pending;

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
