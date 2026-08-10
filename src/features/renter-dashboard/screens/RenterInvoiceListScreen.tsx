import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRenterInvoices } from '../hooks/useRenterPayments';
import { PaymentSkeletonLoader } from '@/features/payments/components/PaymentSkeletonLoader';
import type { RenterRentRecord } from '../types/renterDashboard';
import { showMessage } from 'react-native-flash-message';

const PAGE_SIZE = 20;

export default function RenterInvoiceListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { invoices, isLoading, isFetching, error, refresh, total } = useRenterInvoices({
    page,
    limit: PAGE_SIZE,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      await refresh();
    } catch {
      // handled
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching]);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderInvoiceItem = useCallback(
    ({ item }: { item: RenterRentRecord }) => (
      <View
        style={[
          styles.invoiceCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
        ]}
      >
        <View style={styles.invoiceHeader}>
          <View>
            <Text style={[styles.invoiceTitle, { color: theme.colors.onSurface }]}>
              {item.building_name} — {item.unit_name}
            </Text>
            <Text style={[styles.invoiceDate, { color: theme.colors.onSurfaceVariant }]}>
              {formatDate(item.due_date)}
            </Text>
          </View>
          <Text style={[styles.invoiceAmount, { color: theme.colors.primary }]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>

        <View style={styles.invoiceFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Text
              style={[styles.statusText, { color: theme.colors.onPrimaryContainer }]}
            >
              Paid
            </Text>
          </View>

          <Text
            style={[styles.viewButton, { color: theme.colors.primary }]}
            onPress={() =>
              router.push({
                pathname: '/(drawer)/(tabs)/invoice-detail',
                params: { paymentId: item.id.toString() },
              })
            }
          >
            View →
          </Text>
        </View>
      </View>
    ),
    [theme, router]
  );

  const renderEmpty = useMemo(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
          No Invoices Available
        </Text>
        <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
          Invoices will be available here once your rent payments are verified.
        </Text>
      </View>
    );
  }, [isLoading, theme.colors.onSurface, theme.colors.onSurfaceVariant]);

  const renderFooter = useCallback(() => {
    if (!isFetching) return null;
    return (
      <View style={styles.footerLoader}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading more...</Text>
      </View>
    );
  }, [isFetching, theme.colors.onSurfaceVariant]);

  if (isLoading && !invoices.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={PAGE_SIZE} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !invoices.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={[styles.errorTitle, { color: theme.colors.onSurface }]}>
                Failed to load invoices
              </Text>
              <Text style={[styles.errorDescription, { color: theme.colors.onSurfaceVariant }]}>
                {error}
              </Text>
              <Text
                style={[styles.retryButton, { color: theme.colors.primary }]}
                onPress={handleRefresh}
              >
                Tap to retry
              </Text>
            </View>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Invoices
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {total} {total === 1 ? 'invoice' : 'invoices'}
            </Text>
          </View>

          {!netInfo.isConnected && invoices.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
              <Text style={[styles.offlineSubtext, { color: theme.colors.onSurfaceVariant }]}>
                Please check your internet connection and try again.
              </Text>
            </View>
          ) : invoices.length === 0 ? (
            renderEmpty
          ) : (
            <FlatList
              data={invoices}
              renderItem={renderInvoiceItem}
              keyExtractor={(item) => `invoice-${item.id}`}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={theme.colors.primary}
                />
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  invoiceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  invoiceDate: {
    fontSize: 13,
    marginTop: 2,
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorDescription: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
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
