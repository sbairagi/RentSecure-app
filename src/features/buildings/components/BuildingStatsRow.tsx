import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Building } from '../types/buildings';
import { computeBuildingStats } from '../utils/buildingHelpers';

interface BuildingStatsRowProps {
  building: Building;
}

export const BuildingStatsRow: React.FC<BuildingStatsRowProps> = ({ building }) => {
  const theme = useTheme();
  const stats = computeBuildingStats(building);

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalUnits}</Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Units</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>{stats.occupiedUnits}</Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Occupied</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>{stats.vacantUnits}</Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Vacant</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>N/A</Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Revenue</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
    marginTop: Spacing.xs,
  },
});
