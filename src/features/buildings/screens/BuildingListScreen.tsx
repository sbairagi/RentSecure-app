import { Spacing } from '@/constants/theme';
import { BuildingCard } from '@/features/buildings/components/BuildingCard';
import { BuildingEmptyState } from '@/features/buildings/components/BuildingEmptyState';
import { BuildingErrorState } from '@/features/buildings/components/BuildingErrorState';
import { BuildingFilterSheet } from '@/features/buildings/components/BuildingFilterSheet';
import { BuildingLimitBanner } from '@/features/buildings/components/BuildingLimitBanner';
import { BuildingSearchBar } from '@/features/buildings/components/BuildingSearchBar';
import { BuildingSkeleton } from '@/features/buildings/components/BuildingSkeleton';
import { BuildingSortSheet } from '@/features/buildings/components/BuildingSortSheet';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import type { Building } from '@/features/buildings/types/buildings';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'revenue' | 'occupancy';

export default function BuildingListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { buildings, isLoading, isFetching, error, refresh, createBuilding, deleteBuilding } =
    useBuildings();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState({ city: '', state: '', country: '' });

  const filtered = useMemo(() => {
    let list = [...buildings];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.address_line.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q)
      );
    }
    if (filters.city) list = list.filter((b) => b.city === filters.city);
    if (filters.state) list = list.filter((b) => b.state === filters.state);
    if (filters.country) list = list.filter((b) => b.country === filters.country);
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'alphabetical':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'revenue':
        list.sort((a, b) => (b.units?.length || 0) - (a.units?.length || 0));
        break;
      case 'occupancy':
        list.sort((a, b) => {
          const occA = (a.units || []).filter((u) => u.status === 'occupied').length;
          const occB = (b.units || []).filter((u) => u.status === 'occupied').length;
          return occB - occA;
        });
        break;
    }
    return list;
  }, [buildings, search, filters, sortBy]);

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/buildings/add');
  };

  const handleBuildingPress = (building: Building) => {
    router.push(`/(drawer)/(tabs)/buildings/${building.id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteBuilding(id);
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
          <BuildingSearchBar value={search} onChangeText={setSearch} />
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.actionButton}>
              <Text style={{ color: theme.primary }}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSort(true)} style={styles.actionButton}>
              <Text style={{ color: theme.primary }}>Sort</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
              <Text style={{ color: '#fff' }}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {filtered.length === 0 ? (
            <BuildingEmptyState onAction={handleAdd} />
          ) : (
            <FlatList
              data={filtered}
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
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
});
