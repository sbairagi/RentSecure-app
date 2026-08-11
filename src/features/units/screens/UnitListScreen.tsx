import { Spacing } from '@/constants/theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BulkActions } from '../components/BulkActions';
import { UnitCard } from '../components/UnitCard';
import { UnitEmptyState } from '../components/UnitEmptyState';
import { UnitErrorState } from '../components/UnitErrorState';
import { UnitFilterSheet } from '../components/UnitFilterSheet';
import { UnitLimitBanner } from '../components/UnitLimitBanner';
import { UnitSearchBar } from '../components/UnitSearchBar';
import { UnitSkeleton } from '../components/UnitSkeleton';
import { UnitSortSheet } from '../components/UnitSortSheet';
import { useUnits } from '../hooks/useUnits';
import { useUnitSubscriptionLimits } from '../hooks/useUnitSubscriptionLimits';
import type { SortOption, UnitFilters } from '../types/units';

export default function UnitListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<UnitFilters>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const orderingMap: Record<SortOption, string | undefined> = {
    newest: '-created_at',
    oldest: 'created_at',
    rent_amount: 'rent_amount',
    occupancy: undefined,
    alphabetical: 'unit',
  };

  const params: UnitFilters = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(filters.building ? { building: filters.building } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.unit_type ? { unit_type: filters.unit_type } : {}),
    ...(filters.is_archived !== undefined ? { is_archived: filters.is_archived } : {}),
    ordering: orderingMap[sortBy],
  };

  const { units, isLoading, isFetching, error, refresh, total } = useUnits(Object.keys(params).length > 0 ? params : undefined);
  const { limits } = useUnitSubscriptionLimits();

  const canCreate = limits?.can_create_unit ?? true;

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/units/add');
  };

  const handleUnitPress = (unitId: number) => {
    router.push(`/(drawer)/(tabs)/units/${unitId}`);
  });

  const handleBulkAction = async (action: string, _data?: Record<string, any>) => {
    if (selectedIds.length === 0) return;
    try {
      const { unitsRepository } = await import('../repository/unitsRepository');
      if (action === 'delete') {
        await unitsRepository.bulkDelete(selectedIds);
      } else if (action === 'archive') {
        await unitsRepository.bulkUpdate({
          unit_ids: selectedIds,
          action: 'archive',
          data: { is_archived: true },
        });
      } else if (action === 'unarchive') {
        await unitsRepository.bulkUpdate({
          unit_ids: selectedIds,
          action: 'unarchive',
          data: { is_archived: false },
        });
      }
      setSelectedIds([]);
      refresh();
    } catch {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['unit:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <UnitSkeleton count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['unit:read']}>
          <UnitErrorState message={error} onRetry={refresh} />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['unit:read']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <UnitLimitBanner />
          <UnitSearchBar value={search} onChangeText={setSearch} />
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: '#4f46e5' }]}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSort(true)} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: '#4f46e5' }]}>Sort</Text>
            </TouchableOpacity>
            {canCreate && (
              <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Unit</Text>
              </TouchableOpacity>
            )}
          </View>
          {units.length === 0 ? (
            <UnitEmptyState onAction={canCreate ? handleAdd : undefined} />
          ) : (
            <FlatList
              data={units}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <UnitCard unit={item} onPress={() => handleUnitPress(item.id)} />
              )}
              refreshing={isFetching}
              onRefresh={refresh}
              contentContainerStyle={{ paddingBottom: Spacing.lg }}
            />
          )}
          <UnitFilterSheet
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
            onApply={() => setShowFilters(false)}
          />
          <UnitSortSheet
            visible={showSort}
            onClose={() => setShowSort(false)}
            selected={sortBy}
            onSelect={setSortBy}
          />
          <BulkActions
            selectedIds={selectedIds}
            onAction={handleBulkAction}
            onClearSelection={() => setSelectedIds([])}
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
