import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface UnitCardProps {
  unitNumber: string;
  type: string;
  rent: number;
  status: 'vacant' | 'occupied' | 'reserved';
  tenant?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  vacant: { color: colors.neutral[500], bg: colors.neutral[100], label: 'Vacant' },
  occupied: { color: colors.success[500], bg: colors.success[100], label: 'Occupied' },
  reserved: { color: colors.warning[500], bg: colors.warning[100], label: 'Reserved' },
};

export const UnitCard: React.FC<UnitCardProps> = ({
  unitNumber,
  type,
  rent,
  status,
  tenant,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[status];

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <Text style={[styles.unitNumber, { color: theme.colors.neutral[900] }]}>{unitNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>
      <Text style={[styles.type, { color: theme.colors.neutral[500] }]}>{type}</Text>
      <View style={styles.footer}>
        <Text style={[styles.rent, { color: theme.colors.primary[600] }]}>
          ${rent.toLocaleString()}/mo
        </Text>
        {tenant && (
          <Text style={[styles.tenant, { color: theme.colors.neutral[500] }]} numberOfLines={1}>
            {tenant}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  type: {
    fontSize: 13,
    marginBottom: spacing.md,
  },
  footer: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  rent: {
    fontSize: 18,
    fontWeight: '700',
  },
  tenant: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
