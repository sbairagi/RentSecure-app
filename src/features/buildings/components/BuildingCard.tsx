import { AppCard } from '@/components/common/AppCard';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Building } from '../types/buildings';
import { computeBuildingStats, formatBuildingAddress } from '../utils/buildingHelpers';

interface BuildingCardProps {
  building: Building;
  onPress?: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ building, onPress }) => {
  const theme = useTheme();
  const stats = computeBuildingStats(building);
  const status = building.is_archived ? 'Archived' : 'Active';
  const statusColor = building.is_archived ? Colors.error[500] : Colors.success[500];

  return (
    <AppCard onPress={onPress} padding="md" margin="sm">
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {building.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      <Text style={[styles.address, { color: theme.textSecondary }]} numberOfLines={1}>
        {formatBuildingAddress(building)}
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalUnits}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{stats.occupiedUnits}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Occupied</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{stats.vacantUnits}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Vacant</Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  address: {
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
});
