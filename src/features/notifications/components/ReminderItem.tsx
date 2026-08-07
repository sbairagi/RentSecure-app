import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { Reminder } from '../types';
import { formatTimeAgo } from '../utils';
import { REMINDER_TYPE_CONFIG } from '../constants/notificationTypes';

interface ReminderItemProps {
  reminder: Reminder;
  onPress: (reminder: Reminder) => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onPress }) => {
  const theme = useTheme();
  const typeConfig = REMINDER_TYPE_CONFIG[reminder.type] || REMINDER_TYPE_CONFIG.rent;

  return (
    <TouchableOpacity
      onPress={() => onPress(reminder)}
      style={[styles.container, { borderBottomColor: theme.colors.outlineVariant }]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${typeConfig.color}15` }]}>
        <Text style={styles.icon}>{typeConfig.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
          {reminder.title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
          {reminder.message}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>
            {formatTimeAgo(reminder.scheduled_at)}
          </Text>
          {reminder.retry_count > 0 && (
            <Text style={[styles.retry, { color: theme.colors.error }]}>
              Retry {reminder.retry_count}/{reminder.max_retries}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                reminder.status === 'sent'
                  ? '#059669'
                  : reminder.status === 'failed' || reminder.status === 'permanent_failed'
                  ? '#DC2626'
                  : '#D97706',
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 11,
  },
  retry: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
