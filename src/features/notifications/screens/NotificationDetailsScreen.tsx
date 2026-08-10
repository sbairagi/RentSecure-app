import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotifications } from '../hooks';
import { routeNotification } from '@/navigation/notification-routing/notificationRouter';
import type { Notification } from '../types';

export default function NotificationDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notification, setNotification] = useState<Notification | null>(null);

  const { notifications, isLoading } = useNotifications(undefined, 1, 100);

  useEffect(() => {
    if (!id) return;
    const found = notifications.find((n) => String(n.id) === String(id));
    if (found) {
      setNotification(found);
    }
  }, [id, notifications]);

  const handleAction = useCallback(() => {
    if (!notification) return;
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
    }
  }, [notification, router]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Notification Details
          </Text>
        </View>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!notification) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Notification Details
          </Text>
        </View>
        <Text style={[styles.placeholder, { color: theme.colors.onSurfaceVariant }]}>
          Notification not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Notification Details
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.notificationTitle, { color: theme.colors.onSurface }]}>
          {notification.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.colors.onSurfaceVariant }]}>
          {notification.message}
        </Text>
        <Text style={[styles.notificationMeta, { color: theme.colors.onSurfaceVariant }]}>
          Type: {notification.type || 'N/A'}
        </Text>
        <Text style={[styles.notificationMeta, { color: theme.colors.onSurfaceVariant }]}>
          Status: {notification.is_read ? 'Read' : 'Unread'}
        </Text>
        {notification.resource_type && (
          <Text style={[styles.notificationMeta, { color: theme.colors.onSurfaceVariant }]}>
            Resource: {notification.resource_type} {notification.resource_id ? `#${notification.resource_id}` : ''}
          </Text>
        )}
        {notification.action_url && (
          <Text
            style={[styles.actionLink, { color: theme.colors.primary }]}
            onPress={handleAction}
          >
            {notification.action_label || 'View Details'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  notificationMessage: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  notificationMeta: {
    fontSize: 13,
    marginBottom: 8,
  },
  actionLink: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});
