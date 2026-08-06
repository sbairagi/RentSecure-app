import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { UnitStatusConfig } from '../types/units';

interface UnitStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

export const UnitStatusBadge: React.FC<UnitStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const theme = useTheme();
  const statusConfig = getStatusConfig(status);

  const sizeStyles = {
    small: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 11 },
    medium: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
    large: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusConfig.backgroundColor,
          ...sizeStyles[size],
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: statusConfig.color,
            fontSize: sizeStyles[size].fontSize,
          },
        ]}
      >
        {statusConfig.label}
      </Text>
    </View>
  );
};

function getStatusConfig(status: string): UnitStatusConfig {
  const normalized = status.toLowerCase().replace(/\s+/g, '_');
  const configs: Record<string, UnitStatusConfig> = {
    vacant: { label: 'Vacant', color: '#16a34a', backgroundColor: '#dcfce7' },
    occupied: { label: 'Occupied', color: '#2563eb', backgroundColor: '#dbeafe' },
    reserved: { label: 'Reserved', color: '#d97706', backgroundColor: '#fef3c7' },
    under_maintenance: { label: 'Under Maintenance', color: '#dc2626', backgroundColor: '#fee2e2' },
    notice_period: { label: 'Notice Period', color: '#9333ea', backgroundColor: '#f3e8ff' },
    blocked: { label: 'Blocked', color: '#374151', backgroundColor: '#e5e7eb' },
    archived: { label: 'Archived', color: '#6b7280', backgroundColor: '#f3f4f6' },
  };
  return configs[normalized] || { label: status, color: '#374151', backgroundColor: '#e5e7eb' };
}

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
