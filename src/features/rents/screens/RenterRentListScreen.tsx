import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useRenterRentRecords } from '../hooks/useRenterRentRecords';
import { RentCard, RentSkeletonLoader, RentEmptyState, RentErrorState } from '../components';

export default function RenterRentListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { records, meta, isLoading, error, refresh, refetch } = useRenterRentRecords({ page, limit: 20 });

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

  const handleLoadMore = useCallback(() => {
    if (meta && page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  }, [meta, page]);

  if (isLoading && !records.length) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <RentSkeletonLoader count={5} />
        </View>
      </RouteGuard>
    );
  }

  if (error && !records.length) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <RentErrorState message={error} onRetry={handleRefresh} />
        </View>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            My Rent Records
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {meta?.total || 0} records
          </Text>
        </View>

        {!netInfo.isConnected && records.length === 0 ? (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineIcon}>📡</Text>
            <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
              You're Offline
            </Text>
            <Text style={[styles.offlineSubtext, { color: theme.colors.onSurfaceVariant }]}>
              Please check your internet connection and try again.
            </Text>
          </View>
        ) : records.length === 0 ? (
          <RentEmptyState
            title="No rent records found"
            description="Rent records will appear here once created."
          />
        ) : (
          <>
            {records.map((rent) => (
              <RentCard
                key={rent.id}
                rent={rent}
                onPress={() => router.push(`/(drawer)/(tabs)/rents/renter/${rent.id}` as any)}
              />
            ))}
            {meta && page < meta.totalPages && (
              <Text style={[styles.loadMore, { color: theme.colors.primary }]} onPress={handleLoadMore}>
                Load More
              </Text>
            )}
          </>
        )}
      </View>
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
  loadMore: {
    textAlign: 'center',
    padding: 16,
    fontSize: 15,
    fontWeight: '600',
  },
});
