import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { MaintenanceCard, MaintenanceEmptyState, MaintenanceErrorState, MaintenanceFilterSheet, MaintenanceLimitBanner, MaintenanceSearchBar, MaintenanceSkeleton, MaintenanceSortSheet } from '../components';
import { useMaintenance } from '../hooks';
import type { MaintenanceFilters } from '../types';

type SortOption = 'newest' | 'oldest' | 'priority' | 'status' | 'updated';

export default function MaintenanceListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<MaintenanceFilters>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const orderingMap: Record<SortOption, string> = {
    newest: '-created_at',
    oldest: 'created_at',
    priority: 'priority',
    status: 'status',
    updated: '-updated_at',
  };

  const params: MaintenanceFilters = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.building ? { building: filters.building } : {}),
    ...(filters.unit ? { unit: filters.unit } : {}),
    ...(filters.renter ? { renter: filters.renter } : {}),
    ...(filters.caretaker ? { caretaker: filters.caretaker } : {}),
    ...(filters.vendor ? { vendor: filters.vendor } : {}),
    ordering: orderingMap[sortBy],
  };

  const { requests, isLoading, isFetching, error, refresh } = useMaintenance(Object.keys(params).length > 0 ? params : undefined);

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/maintenance/create');
  };

  const handleRequestPress = (request: any) => {
    router.push(`/(drawer)/(tabs)/maintenance/${request.id}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['maintenance:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <MaintenanceSkeleton count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['maintenance:read']}>
          <MaintenanceErrorState message={error} onRetry={refresh} />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <MaintenanceLimitBanner />
          <MaintenanceSearchBar value={search} onChangeText={setSearch} />
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.actionButton}>
              <Text style={{ color: theme.primary }}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSort(true)} style={styles.actionButton}>
              <Text style={{ color: theme.primary }}>Sort</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
              <Text style={{ color: '#fff' }}>+ New</Text>
            </TouchableOpacity>
          </View>
          {requests.length === 0 ? (
            <MaintenanceEmptyState onAction={handleAdd} />
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <MaintenanceCard
                  title={item.title}
                  description={item.description}
                  category={item.category}
                  priority={item.priority}
                  status={item.status}
                  unitName={item.unit_name}
                  buildingName={item.building_name}
                  renterName={item.renter_name}
                  assignedCaretakerName={item.assigned_caretaker_name}
                  createdAt={item.created_at}
                  onPress={() => handleRequestPress(item)}
                />
              )}
              refreshing={isFetching}
              onRefresh={refresh}
              contentContainerStyle={{ paddingBottom: Spacing.lg }}
            />
          )}
          <MaintenanceFilterSheet
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
            onApply={() => setShowFilters(false)}
          />
          <MaintenanceSortSheet
            visible={showSort}
            onClose={() => setShowSort(false)}
            selected={sortBy}
            onSelect={(value) => setSortBy(value as SortOption)}
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
