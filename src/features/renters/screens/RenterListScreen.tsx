import { Spacing } from '@/constants/theme';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RenterCard } from '../components/RenterCard';
import RenterEmptyState from '../components/RenterEmptyState';
import RenterErrorState from '../components/RenterErrorState';
import { RenterFilterChips } from '../components/RenterFilterChips';
import { RenterSearchBar } from '../components/RenterSearchBar';
import { RenterSkeletonLoader } from '../components/RenterSkeletonLoader';
import { useRenters } from '../hooks/useRenters';
import type { SelectedFilters } from '../types';

export default function RenterListScreen() {
  const router = useRouter();
  const { renters, isLoading, isFetching, error, refresh } = useRenters();
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const filtered = useMemo(() => {
    let list = [...renters];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          (r.email && r.email.toLowerCase().includes(q))
      );
    }
    if (selectedFilters.status) {
      list = list.filter((r) => r.status === selectedFilters.status);
    }
    return list;
  }, [renters, search, selectedFilters]);

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/renters/add');
  };

  const handleRenterPress = (renterId: number) => {
    router.push(`/(drawer)/(tabs)/renters/${renterId}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:read']}>
          <FeatureLimitGuard featureKey="max_renters">
            <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
              <RenterSkeletonLoader type="list" />
            </View>
          </FeatureLimitGuard>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:read']}>
          <FeatureLimitGuard featureKey="max_renters">
            <RenterErrorState message={error} onRetry={refresh} />
          </FeatureLimitGuard>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:read']}>
        <FeatureLimitGuard featureKey="max_renters">
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <RenterSearchBar value={search} onChangeText={setSearch} />
            <RenterFilterChips
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Renter</Text>
              </TouchableOpacity>
            </View>
            {filtered.length === 0 ? (
              <RenterEmptyState onAction={handleAdd} />
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <RenterCard renter={item} onPress={() => handleRenterPress(item.id)} />
                )}
                refreshing={isFetching}
                onRefresh={refresh}
                contentContainerStyle={{ paddingBottom: Spacing.lg }}
              />
            )}
          </View>
        </FeatureLimitGuard>
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
