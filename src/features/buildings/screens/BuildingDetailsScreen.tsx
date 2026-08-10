import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { BuildingStatsRow } from '@/features/buildings/components/BuildingStatsRow';
import { useBuilding } from '@/features/buildings/hooks/useBuilding';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import { useIsOffline } from '@/core/offline';
import {
  formatBuildingAddress,
  getBuildingStatus,
} from '@/features/buildings/utils/buildingHelpers';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BuildingDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const isOffline = useIsOffline();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { building, isLoading, error, refresh } = useBuilding(Number(id));
  const { deleteBuilding, isDeleting } = useBuildings();

  const handleDelete = async () => {
    await deleteBuilding(Number(id));
    router.replace('/(drawer)/(tabs)/buildings/list');
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['building:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !building) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['building:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>{error || 'Building not found'}</Text>
            <Button title="Retry" onPress={refresh} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const status = getBuildingStatus(building);

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['building:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>{building.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: status === 'active' ? '#10b98120' : '#ef444420' },
              ]}
            >
              <Text
                style={[styles.statusText, { color: status === 'active' ? '#10b981' : '#ef4444' }]}
              >
                {status}
              </Text>
            </View>
            <Text style={[styles.address, { color: theme.textSecondary }]}>
              {formatBuildingAddress(building)}
            </Text>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              Postal Code: {building.postal_code}
            </Text>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              Created: {new Date(building.created_at).toLocaleDateString()}
            </Text>
          </View>
          <BuildingStatsRow building={building} />
          <View style={styles.actions}>
            <Button
              title="View Units"
              variant="outlined"
              onPress={() =>
                router.push(`/(drawer)/(tabs)/units/list?building=${building.id}`)
              }
            />
            <PermissionGuard permissions={['building:write']}>
              <Button
                title="Edit"
                variant="outlined"
                onPress={() =>
                  router.push(`/(drawer)/(tabs)/buildings/${building.id}/edit`)
                }
                disabled={isOffline}
              />
            </PermissionGuard>
            <PermissionGuard permissions={['building:write']}>
              <Button
                title="Delete"
                variant="ghost"
                onPress={() =>
                  router.push(`/(drawer)/(tabs)/buildings/${building.id}/delete`)
                }
                disabled={isOffline}
              />
            </PermissionGuard>
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  meta: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
