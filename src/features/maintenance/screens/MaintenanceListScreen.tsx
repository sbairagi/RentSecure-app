import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
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
  const { requests, isLoading, isFetching, error, refresh } = useMaintenance();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<MaintenanceFilters>({});

  const filtered = useMemo(() => {
    let list = [...requests];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.unit_name?.toLowerCase().includes(q) ||
          r.building_name?.toLowerCase().includes(q) ||
          r.renter_name?.toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      list = list.filter((r) => r.status === filters.status);
    }
    if (filters.priority) {
      list = list.filter((r) => r.priority === filters.priority);
    }
    if (filters.category) {
      list = list.filter((r) => r.category === filters.category);
    }
    if (filters.building) {
      list = list.filter((r) => r.building === filters.building);
    }
    if (filters.unit) {
      list = list.filter((r) => r.unit === filters.unit);
    }
    if (filters.renter) {
      list = list.filter((r) => r.renter === filters.renter);
    }
    if (filters.caretaker) {
      list = list.filter((r) => r.assigned_caretaker === filters.caretaker);
    }
    if (filters.vendor) {
      list = list.filter((r) => r.assigned_vendor === filters.vendor);
    }
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'priority':
        const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
        list.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));
        break;
      case 'status':
        list.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'updated':
        list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }
    return list;
  }, [requests, search, filters, sortBy]);

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
          {filtered.length === 0 ? (
            <MaintenanceEmptyState onAction={handleAdd} />
          ) : (
            <FlatList
              data={filtered}
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
