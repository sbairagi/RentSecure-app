import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useRentRecords } from '../hooks/useRentRecords';
import { RentCard, RentFilters, RentSkeletonLoader, RentEmptyState, RentErrorState } from '../components';
import { RENT_CONSTANTS } from '../constants/rents';
import type { RentFilters as RentFiltersType } from '../types/rents';

export default function OwnerRentListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const [filters, setFilters] = useState<RentFiltersType>({});
  const [refreshing, setRefreshing] = useState(false);

  const { rentRecords, isLoading, error, refresh, refetch, total } = useRentRecords(filters);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {
      // Error handled
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleCreateRent = useCallback(() => {
    router.push('/(drawer)/(tabs)/rents/create' as any);
  }, [router]);

  if (isLoading && !rentRecords.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['rent:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <RentSkeletonLoader count={8} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !rentRecords.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['rent:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <RentErrorState message={error} onRetry={handleRefresh} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['rent:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Rent Records
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {total} records found
            </Text>
          </View>

          <RentFilters
            filters={filters}
            onFilterChange={setFilters}
            onClear={() => setFilters({})}
          />

          {!netInfo.isConnected && rentRecords.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
              <Text style={[styles.offlineSubtext, { color: theme.colors.onSurfaceVariant }]}>
                Please check your internet connection and try again.
              </Text>
            </View>
          ) : rentRecords.length === 0 ? (
            <RentEmptyState
              title="No rent records found"
              description="Rent records will appear here once created."
              actionLabel="Create Rent Record"
              onAction={handleCreateRent}
            />
          ) : (
            rentRecords.map((rent) => (
              <RentCard
                key={rent.id}
                rent={rent}
                onPress={() => router.push(`/(drawer)/(tabs)/rents/${rent.id}` as any)}
                onRetryPayout={() => router.push(`/(drawer)/(tabs)/rents/${rent.id}/retry-payout` as any)}
                onResendConfirmation={() => router.push(`/(drawer)/(tabs)/rents/${rent.id}/resend` as any)}
              />
            ))
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  offlineIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  offlineText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  offlineSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
