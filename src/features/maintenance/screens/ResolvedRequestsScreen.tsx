import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { MaintenanceCard, MaintenanceEmptyState, MaintenanceErrorState, MaintenanceSearchBar, MaintenanceSkeleton } from '../components';
import { useMaintenance } from '../hooks';

export default function ResolvedRequestsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { requests, isLoading, error, refresh } = useMaintenance();
  const [search, setSearch] = useState('');

  const resolvedRequests = useMemo(() => {
    return requests.filter((r) => r.status === 'resolved');
  }, [requests]);

  const filtered = useMemo(() => {
    let list = [...resolvedRequests];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [resolvedRequests, search]);

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
          <MaintenanceSearchBar value={search} onChangeText={setSearch} />
          {filtered.length === 0 ? (
            <MaintenanceEmptyState
              title="No resolved requests"
              description="Resolved maintenance requests will appear here."
              actionLabel="View All Requests"
              onAction={() => router.push('/(drawer)/(tabs)/maintenance')}
            />
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
              refreshing={false}
              onRefresh={refresh}
              contentContainerStyle={{ paddingBottom: Spacing.lg }}
            />
          )}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
