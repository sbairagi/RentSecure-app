import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';
import { showMessage } from 'react-native-flash-message';
import { NotificationFilterSheet } from '../components/NotificationFilterSheet';
import { NotificationSearchBar } from '../components/NotificationSearchBar';
import { NotificationEmptyState } from '../components/NotificationEmptyState';
import { NotificationErrorState } from '../components/NotificationErrorState';
import { NotificationSkeletonLoader } from '../components/NotificationSkeletonLoader';
import { NotificationCard } from '../components/NotificationCard';
import { useNotifications, useMarkAllAsRead } from '../hooks';
import { useNotificationStore } from '../store/notificationStore';
import type { NotificationFilters, Notification } from '../types';
import { groupNotificationsByDate } from '../utils';

export default function NotificationCenterScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const { unreadCount } = useNotificationStore();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [page] = useState(1);

  const {
    notifications,
    isLoading,
    error,
    refetch,
  } = useNotifications(filters, page, 20);

  const { mutate: markAllAsRead, isPending: isMarkingAllRead } = useMarkAllAsRead();

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
    (notification: Notification) => {
      showMessage({
        message: notification.title,
        description: notification.message,
        type: 'info',
        duration: 3000,
      });
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const renderDateSection = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <View key={title} style={styles.dateSection}>
        <Text style={[styles.dateTitle, { color: theme.colors.onSurfaceVariant }]}>
          {title}
        </Text>
        {items.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onPress={handleNotificationPress}
          />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return <NotificationSkeletonLoader count={5} />;
  }

  if (error) {
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
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
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
            You&apos;re offline. Showing cached notifications.
          </Text>
        </View>
      )}

      {filteredNotifications.length === 0 ? (
        <NotificationEmptyState
          title="No notifications"
          message="You're all caught up!"
          actionLabel={search ? 'Clear search' : undefined}
          onAction={search ? () => setSearch('') : undefined}
        />
      ) : (
        <View style={styles.listContainer}>
          {renderDateSection('Today', grouped.today)}
          {renderDateSection('Yesterday', grouped.yesterday)}
          {renderDateSection('This Week', grouped.thisWeek)}
          {renderDateSection('This Month', grouped.thisMonth)}
          {renderDateSection('Older', grouped.older)}
        </View>
      )}

      <NotificationFilterSheet
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
      />
    </View>
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
});
