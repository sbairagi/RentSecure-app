import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface BuildingCardProps {
  name: string;
  property: string;
  floors: number;
  units: number;
  status: 'active' | 'maintenance' | 'inactive';
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  active: { color: colors.success[500], bg: colors.success[100], label: 'Active' },
  maintenance: { color: colors.warning[500], bg: colors.warning[100], label: 'Maintenance' },
  inactive: { color: colors.error[500], bg: colors.error[100], label: 'Inactive' },
};

export const BuildingCard: React.FC<BuildingCardProps> = ({
  name,
  property,
  floors,
  units,
  status,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[status];

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.neutral[900] }]} numberOfLines={1}>
          {name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>
      <Text style={[styles.property, { color: theme.colors.neutral[500] }]}>{property}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.neutral[900] }]}>{floors}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Floors</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.neutral[900] }]}>{units}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Units</Text>
        </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
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
  property: {
    fontSize: 13,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
