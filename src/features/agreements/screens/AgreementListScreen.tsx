import { Spacing } from '@/constants/theme';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { AgreementCard } from '../components/AgreementCard';
import AgreementEmptyState from '../components/AgreementEmptyState';
import AgreementErrorState from '../components/AgreementErrorState';
import AgreementFilterSheet from '../components/AgreementFilterSheet';
import { AgreementSkeletonLoader } from '../components/AgreementSkeletonLoader';
import { useAgreements } from '../hooks/useAgreements';
import type { AgreementFilters } from '../types';

export default function AgreementListScreen() {
  const router = useRouter();
  const { agreements, isLoading, isFetching, error, refresh } = useAgreements();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<AgreementFilters>({});

  const filtered = useMemo(() => {
    let list = [...agreements];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a.renter_name && a.renter_name.toLowerCase().includes(q)) ||
          (a.unit_name && a.unit_name.toLowerCase().includes(q)) ||
          (a.building_name && a.building_name.toLowerCase().includes(q)) ||
          String(a.id).includes(q)
      );
    }
    if (selectedFilters.status) {
      list = list.filter((a) => (a.status || 'draft') === selectedFilters.status);
    }
    return list;
  }, [agreements, search, selectedFilters]);

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
            </View>
            <AgreementFilterSheet
              visible={showFilters}
              onClose={() => setShowFilters(false)}
              filters={selectedFilters}
              onApply={setSelectedFilters}
            />
            {filtered.length === 0 ? (
              <AgreementEmptyState onAction={handleAdd} />
            ) : (
              <FlatList
                data={filtered}
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
