import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useBuilding } from '@/features/buildings/hooks/useBuilding';
import { useBuildingAnalytics } from '@/features/buildings/hooks/useBuildingAnalytics';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/authStore';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BuildingAnalyticsScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { building, isLoading } = useBuilding(Number(id), user?.id);
  const { data: analytics, error: analyticsError, refetch } = useBuildingAnalytics(Number(id), user?.id);

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['building:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Loading analytics...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const totalUnits = building?.units_count ?? analytics?.total_units ?? 0;
  const occupiedUnits = building?.occupied_units_count ?? analytics?.occupied_units ?? 0;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  const displayAnalytics = analytics || building
    ? {
        building_id: building?.id ?? analytics?.building_id ?? 0,
        building_name: building?.name ?? analytics?.building_name ?? '',
        total_units: totalUnits,
        occupied_units: occupiedUnits,
        vacant_units: vacantUnits,
        occupancy_rate: analytics?.occupancy_rate ?? occupancyRate,
      }
    : null;

  if (!displayAnalytics) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['building:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>No analytics available</Text>
            <Button title="Retry" onPress={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['building:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {displayAnalytics.building_name}
            </Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {displayAnalytics.total_units}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Units</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {displayAnalytics.occupied_units}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Occupied</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {displayAnalytics.vacant_units}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Vacant</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {(displayAnalytics.occupancy_rate || occupancyRate).toFixed(1)}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Occupancy Rate
                </Text>
              </View>
            </View>
            {analyticsError && (
              <Button title="Retry Analytics" variant="outlined" onPress={refetch} />
            )}
          </View>
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
