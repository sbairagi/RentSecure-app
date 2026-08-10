import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';
import { showMessage } from 'react-native-flash-message';
import { useRouter } from 'expo-router';
import { NotificationFilterSheet } from '../components/NotificationFilterSheet';
import { NotificationSearchBar } from '../components/NotificationSearchBar';
import { NotificationEmptyState } from '../components/NotificationEmptyState';
import { NotificationErrorState } from '../components/NotificationErrorState';
import { NotificationSkeletonLoader } from '../components/NotificationSkeletonLoader';
import { NotificationCard } from '../components/NotificationCard';
import { useNotifications, useMarkAllAsRead, useUnreadCount, useMarkAsRead } from '../hooks';
import { useNotificationStore } from '../store/notificationStore';
import type { NotificationFilters, Notification } from '../types';
import { groupNotificationsByDate } from '../utils';
import { routeNotification } from '@/navigation/notification-routing/notificationRouter';

export default function NotificationCenterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const { unreadCount: storeUnreadCount } = useNotificationStore();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [page, setPage] = useState(1);

  const {
    notifications,
    pagination,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useNotifications(filters, page, 20);

  const { mutate: markAllAsRead, isPending: isMarkingAllRead } = useMarkAllAsRead();
  const { mutate: markAsRead } = useMarkAsRead();
  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData ?? storeUnreadCount;

  const filteredNotifications = useMemo(() => {
    if (!search.trim()) return notifications;
    const q = search.toLowerCase();
    return notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
    );
  }, [notifications, search]);

  const grouped = useMemo(() => groupNotificationsByDate(filteredNotifications), [filteredNotifications]);

  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        markAsRead(notification.id);
      }

      const result = routeNotification({
        id: String(notification.id),
        title: notification.title,
        message: notification.message,
        data: {
          resource_id: notification.resource_id,
          resource_type: notification.resource_type,
          notification_type: notification.type,
          ...notification.data,
        },
      });

      if (result.success && result.route) {
        router.replace(result.route as any);
      } else {
        showMessage({
          message: notification.title,
          description: notification.message,
          type: 'info',
          duration: 3000,
        });
      }
    },
    [markAsRead, router]
  );

  const handleRefresh = useCallback(async () => {
    setPage(1);
    await refetch();
  }, [refetch]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleLoadMore = useCallback(() => {
    if (pagination && page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [pagination, page]);

  const hasMore = pagination ? page < pagination.totalPages : false;

  if (isLoading && page === 1) {
    return <NotificationSkeletonLoader count={5} />;
  }

  if (error && page === 1) {
    return (
      <NotificationErrorState
        message={error}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <View style={styles.headerActions}>
            <IconButton
              icon="check-all"
              size={20}
              onPress={handleMarkAllRead}
              disabled={isMarkingAllRead}
              iconColor={theme.colors.primary}
            />
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          </View>
        )}
      </View>

      <NotificationSearchBar
        value={search}
        onChange={setSearch}
        onFilterPress={() => setShowFilters(true)}
      />

      {!netInfo.isConnected && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.colors.errorContainer }]}>
          <Text style={[styles.offlineText, { color: theme.colors.onErrorContainer }]}>
            You're offline. Showing cached notifications.
          </Text>
        </View>
      )}

      {filteredNotifications.length === 0 && !isFetching ? (
        <NotificationEmptyState
          title="No notifications"
          message="You&apos;re all caught up!"
          actionLabel={search ? 'Clear search' : undefined}
          onAction={search ? () => setSearch('') : undefined}
        />
      ) : (
        <View style={styles.listContainer}>
          {renderDateSection('Today', grouped.today, handleNotificationPress)}
          {renderDateSection('Yesterday', grouped.yesterday, handleNotificationPress)}
          {renderDateSection('This Week', grouped.thisWeek, handleNotificationPress)}
          {renderDateSection('This Month', grouped.thisMonth, handleNotificationPress)}
          {renderDateSection('Older', grouped.older, handleNotificationPress)}

          {hasMore && (
            <View style={styles.loadMoreContainer}>
              <IconButton
                icon="chevron-down"
                size={24}
                onPress={handleLoadMore}
                disabled={isFetching}
                iconColor={theme.colors.primary}
              />
              <Text style={[styles.loadMoreText, { color: theme.colors.primary }]}>
                {isFetching ? 'Loading...' : 'Load More'}
              </Text>
            </View>
          )}
        </View>
      )}

      <NotificationFilterSheet
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
      />
    </View>
  );
}

const renderDateSection = (
  title: string,
  items: Notification[],
  onPress: (notification: Notification) => void
) => {
  if (items.length === 0) return null;
  return (
    <View key={title} style={styles.dateSection}>
      <Text style={[styles.dateTitle, { color: '#6B7280' }]}>
        {title}
      </Text>
      {items.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onPress={onPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  offlineBanner: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
