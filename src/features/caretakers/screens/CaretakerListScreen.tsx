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
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'joining_date_desc' | 'joining_date_asc';

export default function CaretakerListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { caretakers, isLoading, isFetching, error, refresh } = useCaretakers();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<CaretakerFilters>({});

  const filtered = useMemo(() => {
    let list = [...caretakers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (filters.is_active !== undefined) {
      list = list.filter((c) => c.is_active === filters.is_active);
    }
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'joining_date_desc':
        list.sort((a, b) => new Date(b.joining_date).getTime() - new Date(a.joining_date).getTime());
        break;
      case 'joining_date_asc':
        list.sort((a, b) => new Date(a.joining_date).getTime() - new Date(b.joining_date).getTime());
        break;
    }
    return list;
  }, [caretakers, search, filters, sortBy]);

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
          {filtered.length === 0 ? (
            <CaretakerEmptyState onAction={handleAdd} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CaretakerCard
                  name={item.name}
                  phone={item.phone}
                  email={item.email}
                  unitName={item.unit.toString()}
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
