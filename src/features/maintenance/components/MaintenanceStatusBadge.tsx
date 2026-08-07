import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';
import type { MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from '../types';

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
  size?: 'small' | 'medium';
}

export const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const config = MAINTENANCE_CONSTANTS.STATUS_CONFIG[status] || MAINTENANCE_CONSTANTS.STATUS_CONFIG.created;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: size === 'small' ? 6 : 10,
          paddingVertical: size === 'small' ? 2 : 4,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: size === 'small' ? 11 : 13,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

interface MaintenancePriorityBadgeProps {
  priority: MaintenancePriority;
  size?: 'small' | 'medium';
}

export const MaintenancePriorityBadge: React.FC<MaintenancePriorityBadgeProps> = ({ priority, size = 'medium' }) => {
  const config = MAINTENANCE_CONSTANTS.PRIORITY_CONFIG[priority] || MAINTENANCE_CONSTANTS.PRIORITY_CONFIG.medium;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: size === 'small' ? 6 : 10,
          paddingVertical: size === 'small' ? 2 : 4,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: size === 'small' ? 11 : 13,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

interface MaintenanceCategoryBadgeProps {
  category: MaintenanceCategory;
  size?: 'small' | 'medium';
}

export const MaintenanceCategoryBadge: React.FC<MaintenanceCategoryBadgeProps> = ({ category, size = 'medium' }) => {
  const theme = useTheme();
  const label = MAINTENANCE_CONSTANTS.CATEGORY_LABELS[category] || category;
  const icon = MAINTENANCE_CONSTANTS.CATEGORY_ICONS[category] || '📋';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderWidth: 1,
          paddingHorizontal: size === 'small' ? 6 : 10,
          paddingVertical: size === 'small' ? 2 : 4,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.text,
            fontSize: size === 'small' ? 11 : 13,
          },
        ]}
      >
        {icon} {label}
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
  },
});
