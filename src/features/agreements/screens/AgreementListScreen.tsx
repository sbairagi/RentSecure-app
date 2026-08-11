import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { RouteGuard } from '@/navigation/components';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { AgreementCard } from '../components/AgreementCard';
import AgreementEmptyState from '../components/AgreementEmptyState';
import AgreementErrorState from '../components/AgreementErrorState';
import AgreementFilterSheet from '../components/AgreementFilterSheet';
import { AgreementSkeletonLoader } from '../components/AgreementSkeletonLoader';
import { useAgreements } from '../hooks/useAgreements';
import type { AgreementFilters } from '../types';

type SortOption = 'newest' | 'oldest' | 'start_date' | 'end_date' | 'status' | 'renter';

export default function AgreementListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<AgreementFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const orderingMap: Record<SortOption, string> = {
    newest: '-generated_at',
    oldest: 'generated_at',
    start_date: 'agreement_start_date',
    end_date: 'agreement_end_date',
    status: 'status',
    renter: 'renter__name',
  };

  const params: AgreementFilters = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(selectedFilters.status ? { status: selectedFilters.status } : {}),
    ...(selectedFilters.building ? { building: Number(selectedFilters.building) } : {}),
    ...(selectedFilters.unit ? { unit: Number(selectedFilters.unit) } : {}),
    ...(selectedFilters.renter ? { renter: Number(selectedFilters.renter) } : {}),
    ordering: orderingMap[sortBy],
  };

  const { agreements, isLoading, isFetching, error, refresh } = useAgreements(Object.keys(params).length > 0 ? params : undefined);

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/agreements/create');
  };

  const handleAgreementPress = (agreementId: number) => {
    router.push(`/(drawer)/(tabs)/agreements/${agreementId}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:read']}>
          <FeatureLimitGuard featureKey="rent_agreement_drafts">
            <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
              <AgreementSkeletonLoader type="list" />
            </View>
          </FeatureLimitGuard>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:read']}>
          <FeatureLimitGuard featureKey="rent_agreement_drafts">
            <AgreementErrorState message={error} onRetry={refresh} />
          </FeatureLimitGuard>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:read']}>
        <FeatureLimitGuard featureKey="rent_agreement_drafts">
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: '#111827' }]}>Agreements</Text>
              <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Create</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchRow}>
              <TextInput
                style={[styles.searchInput, { color: '#111827', borderColor: '#e5e7eb' }]}
                placeholder="Search agreements..."
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
            </View>
            <View style={styles.toolbar}>
              <TouchableOpacity
                onPress={() => setShowFilters(true)}
                style={styles.toolButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Open filters"
              >
                <Text style={styles.toolButtonText}>Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const options: SortOption[] = ['newest', 'oldest', 'start_date', 'end_date', 'status', 'renter'];
                  const currentIndex = options.indexOf(sortBy);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setSortBy(options[nextIndex]);
                }}
                style={styles.toolButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Sort"
              >
                <Text style={styles.toolButtonText}>
                  Sort: {sortBy.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            </View>
            <AgreementFilterSheet
              visible={showFilters}
              onClose={() => setShowFilters(false)}
              filters={selectedFilters}
              onApply={setSelectedFilters}
            />
            {agreements.length === 0 ? (
              <AgreementEmptyState onAction={handleAdd} />
            ) : (
              <FlatList
                data={agreements}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <AgreementCard
                    agreement={item}
                    onPress={() => handleAgreementPress(item.id)}
                    onEdit={() =>
                      router.push(`/(drawer)/(tabs)/agreements/${item.id}/edit`)
                    }
                    onDelete={() =>
                      router.push(`/(drawer)/(tabs)/agreements/${item.id}/delete`)
                    }
                    onSign={() =>
                      router.push(`/(drawer)/(tabs)/agreements/${item.id}/sign`)
                    }
                    onGeneratePDF={() =>
                      router.push(`/(drawer)/(tabs)/agreements/${item.id}/pdf`)
                    }
                  />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
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
  searchRow: {
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  toolButton: {
    backgroundColor: '#fff',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toolButtonText: {
    fontSize: 14,
    color: '#374151',
  },
});
