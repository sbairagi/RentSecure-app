import { Spacing } from '@/constants/theme';
import { BuildingCard } from '@/features/buildings/components/BuildingCard';
import { BuildingEmptyState } from '@/features/buildings/components/BuildingEmptyState';
import { BuildingErrorState } from '@/features/buildings/components/BuildingErrorState';
import { BuildingLimitBanner } from '@/features/buildings/components/BuildingLimitBanner';
import { BuildingSkeleton } from '@/features/buildings/components/BuildingSkeleton';
import { useIsOffline } from '@/core/offline';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import type { Building } from '@/features/buildings/types/buildings';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BuildingListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const isOffline = useIsOffline();
  const { buildings, isLoading, isFetching, error, refresh } = useBuildings();

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/buildings/add');
  };

  const handleBuildingPress = (building: Building) => {
    router.push(`/(drawer)/(tabs)/buildings/${building.id}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['building:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <BuildingSkeleton count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['building:read']}>
          <BuildingErrorState message={error} onRetry={refresh} />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['building:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <BuildingLimitBanner />
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.addButton, isOffline && styles.disabledButton]}
              disabled={isOffline}
            >
              <Text style={{ color: '#fff' }}>+ Add Building</Text>
            </TouchableOpacity>
          </View>
          {buildings.length === 0 ? (
            <BuildingEmptyState onAction={isOffline ? undefined : handleAdd} />
          ) : (
            <FlatList
              data={buildings}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <BuildingCard building={item} onPress={() => handleBuildingPress(item)} />
              )}
              refreshing={isFetching}
              onRefresh={refresh}
              contentContainerStyle={{ paddingBottom: Spacing.lg }}
            />
          )}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});
