import { Spacing } from '@/constants/theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function UnitListScreen() {
  const router = useRouter();
  const { units, isLoading, isFetching, error, refresh } = useUnits();
  const { limits } = useUnitSubscriptionLimits();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<UnitFilters>({});

  const debouncedSearch = useDebouncedValue(search, 300);

  const canCreate = limits?.can_create_unit ?? true;

  const filtered = useMemo(() => {
    let list = [...units];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.unit.toLowerCase().includes(q) ||
          u.building_name.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.unit_type.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'alphabetical':
        list.sort((a, b) => a.unit.localeCompare(b.unit));
        break;
      case 'occupancy':
        list.sort((a, b) => Number(b.is_vacant) - Number(a.is_vacant));
        break;
    }
    return list;
  }, [units, debouncedSearch, sortBy]);

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/units/add');
  };

  const handleUnitPress = (unitId: number) => {
    router.push(`/(drawer)/(tabs)/units/${unitId}`);
  };

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
          {filtered.length === 0 ? (
            <UnitEmptyState onAction={canCreate ? handleAdd : undefined} />
          ) : (
            <FlatList
              data={filtered}
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
