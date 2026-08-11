import { Spacing } from '@/constants/theme';
import { BuildingCard } from '@/features/buildings/components/BuildingCard';
import { BuildingEmptyState } from '@/features/buildings/components/BuildingEmptyState';
import { BuildingErrorState } from '@/features/buildings/components/BuildingErrorState';
import { BuildingFilterSheet } from '@/features/buildings/components/BuildingFilterSheet';
import { BuildingLimitBanner } from '@/features/buildings/components/BuildingLimitBanner';
import { BuildingSortSheet } from '@/features/buildings/components/BuildingSortSheet';
import { BuildingSkeleton } from '@/features/buildings/components/BuildingSkeleton';
import { useIsOffline } from '@/core/offline';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import type { Building, BuildingFilters } from '@/features/buildings/types/buildings';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/authStore';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BuildingListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const isOffline = useIsOffline();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical' | 'revenue' | 'occupancy'>('newest');
  const [filters, setFilters] = useState<BuildingFilters>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const orderingMap: Record<string, string> = {
    newest: '-created_at',
    oldest: 'created_at',
    alphabetical: 'name',
    revenue: '-occupied_units_count',
    occupancy: 'is_archived',
  };

  const apiParams: BuildingFilters = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.country ? { country: filters.country } : {}),
    ordering: orderingMap[sortBy],
  };

  const { buildings, isLoading, isFetching, error, refresh } = useBuildings(user?.id, Object.keys(apiParams).length > 0 ? apiParams : undefined);

  const canCreate = true;

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
            <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: theme.primary }]}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSort(true)} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: theme.primary }]}>Sort</Text>
            </TouchableOpacity>
            {canCreate && (
              <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Building</Text>
              </TouchableOpacity>
            )}
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
          <BuildingFilterSheet
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
            onApply={() => setShowFilters(false)}
          />
          <BuildingSortSheet
            visible={showSort}
            onClose={() => setShowSort(false)}
            selected={sortBy}
            onSelect={setSortBy}
          />
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
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
