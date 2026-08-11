import { Spacing } from '@/constants/theme';
import {
  CaretakerCard,
  CaretakerEmptyState,
  CaretakerErrorState,
  CaretakerFilterSheet,
  CaretakerLimitBanner,
  CaretakerSearchBar,
  CaretakerSkeleton,
  CaretakerSortSheet,
} from '@/features/caretakers/components';
import { useCaretakers } from '@/features/caretakers/hooks';
import type { Caretaker, CaretakerFilters } from '@/features/caretakers/types';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'joining_date_desc' | 'joining_date_asc';

export default function CaretakerListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<CaretakerFilters>({});

  const apiParams: CaretakerFilters = {
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(filters.is_active !== undefined ? { is_active: filters.is_active } : {}),
    ordering: sortBy === 'newest' ? '-joining_date' : sortBy === 'oldest' ? 'joining_date' : sortBy === 'name_asc' ? 'name' : sortBy === 'name_desc' ? '-name' : sortBy === 'joining_date_desc' ? '-joining_date' : 'joining_date',
  };

  const { caretakers, isLoading, isFetching, error, refresh } = useCaretakers(apiParams);

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/caretakers/add');
  };

  const handleCaretakerPress = (caretaker: Caretaker) => {
    router.push(`/(drawer)/(tabs)/caretakers/${caretaker.id}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <CaretakerSkeleton count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:read']}>
          <CaretakerErrorState message={error} onRetry={refresh} />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <CaretakerLimitBanner />
          <CaretakerSearchBar value={search} onChangeText={setSearch} />
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
          {caretakers.length === 0 ? (
            <CaretakerEmptyState onAction={handleAdd} />
          ) : (
            <FlatList
              data={caretakers}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CaretakerCard
                  name={item.name}
                  phone={item.phone}
                  email={item.email}
                  unitName={`Unit ${item.unit}`}
                  isActive={item.is_active}
                  joiningDate={item.joining_date}
                  onPress={() => handleCaretakerPress(item)}
                />
              )}
              refreshing={isFetching}
              onRefresh={refresh}
              contentContainerStyle={{ paddingBottom: Spacing.lg }}
            />
          )}
          <CaretakerFilterSheet
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
            onApply={() => setShowFilters(false)}
          />
          <CaretakerSortSheet
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
