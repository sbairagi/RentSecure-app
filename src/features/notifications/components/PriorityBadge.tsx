import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NotificationPriority } from '../types';
import { PRIORITY_CONFIG } from '../constants/notificationTypes';

interface PriorityBadgeProps {
  priority: NotificationPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

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
