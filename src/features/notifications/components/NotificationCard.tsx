import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { Notification } from '../types';
import { formatTimeAgo } from '../utils';
import { UnreadBadge } from './UnreadBadge';
import { PriorityBadge } from './PriorityBadge';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {notification.title}
          </Text>
          <View style={styles.badges}>
            {notification.priority && <PriorityBadge priority={notification.priority} />}
            {!notification.is_read && <UnreadBadge />}
          </View>
        </View>
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {notification.message}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>
            {formatTimeAgo(notification.created_at)}
          </Text>
          {notification.channels && notification.channels.length > 0 && (
            <View style={styles.channels}>
              {notification.channels.map((channel) => (
                <View
                  key={channel}
                  style={[styles.channelBadge, { backgroundColor: theme.colors.primaryContainer }]}
                >
                  <Text style={[styles.channelText, { color: theme.colors.onPrimaryContainer }]}>
                    {channel.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
  },
  channels: {
    flexDirection: 'row',
    gap: 4,
  },
  channelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  channelText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
