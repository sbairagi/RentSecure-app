import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Divider, List, Text, useTheme } from 'react-native-paper';
import { dashboardApi } from '../services/dashboardApi';
import type { DashboardNotification } from '../types/dashboard';

interface DashboardNotificationsProps {
  preview?: boolean;
  onMarkAllRead?: () => void;
}

export const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({
  preview = false,
  onMarkAllRead,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications-preview'],
    queryFn: async () => {
      return dashboardApi.getNotifications();
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const displayNotifications = preview ? notifications?.slice(0, 3) || [] : notifications || [];

  const handleMarkAllRead = async () => {
    if (isMarkingRead) return;
    setIsMarkingRead(true);
    try {
      const unreadNotifications =
        notifications?.filter((n: DashboardNotification) => !n.is_read) || [];
      for (const notification of unreadNotifications) {
        await dashboardApi.markNotificationRead(notification.id);
      }
      refetch();
      onMarkAllRead?.();
    } catch {
      // Error handled by query
    } finally {
      setIsMarkingRead(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications?.filter((n: DashboardNotification) => !n.is_read).length || 0;

  const renderNotification = ({ item }: { item: DashboardNotification }) => (
    <TouchableOpacity
      onPress={() => router.push('/(drawer)/(tabs)/notifications')}
      activeOpacity={0.7}
    >
      <List.Item
        title={item.title}
        description={item.message}
        descriptionNumberOfLines={2}
        left={() => (
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: item.is_read
                  ? theme.colors.surfaceVariant
                  : `${theme.colors.primary}15`,
              },
            ]}
          >
            <Text style={styles.avatarText}>{item.title.charAt(0).toUpperCase()}</Text>
            {!item.is_read && (
              <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
            )}
          </View>
        )}
        right={() => (
          <View style={styles.rightContent}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}
            >
              {formatTimeAgo(item.created_at)}
            </Text>
          </View>
        )}
        titleStyle={{ color: theme.colors.onSurface, fontWeight: item.is_read ? '400' : '600' }}
        descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        style={[styles.listItem, { borderBottomColor: theme.colors.outlineVariant }]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleMarkAllRead}
              disabled={isMarkingRead}
              style={styles.markAllButton}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '600' }}>
                Mark all read
              </Text>
            </TouchableOpacity>
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          </View>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading notifications...</Text>
        </View>
      ) : displayNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>No notifications yet</Text>
        </View>
      ) : (
        <Card
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
          ]}
        >
          <FlatList
            data={displayNotifications}
            renderItem={renderNotification}
            keyExtractor={(item) => `${item.id}`}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <Divider />}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  markAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: 50,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
