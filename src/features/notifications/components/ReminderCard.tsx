import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import type { Reminder } from '../types';
import { formatDateTime } from '../utils';
import { REMINDER_TYPE_CONFIG } from '../constants/notificationTypes';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';

interface ReminderCardProps {
  reminder: Reminder;
  onPress?: (reminder: Reminder) => void;
  onRetry?: (reminder: Reminder) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onPress,
  onRetry,
}) => {
  const theme = useTheme();
  const typeConfig = REMINDER_TYPE_CONFIG[reminder.type] || REMINDER_TYPE_CONFIG.rent;

  return (
    <Card
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => onPress?.(reminder)}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{typeConfig.icon}</Text>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              {reminder.title}
            </Text>
          </View>
          <DeliveryStatusBadge status={reminder.status} />
        </View>

        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {reminder.message}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
              Scheduled:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
              {formatDateTime(reminder.scheduled_at)}
            </Text>
          </View>
          {reminder.sent_at && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                Sent:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                {formatDateTime(reminder.sent_at)}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
              Channel:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
              {reminder.delivery_channel?.toUpperCase() || 'WHATSAPP'}
            </Text>
          </View>
          {reminder.retry_count > 0 && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                Retries:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                {reminder.retry_count}/{reminder.max_retries}
              </Text>
            </View>
          )}
          {reminder.error_message && (
            <View style={styles.errorRow}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {reminder.error_message}
              </Text>
            </View>
          )}
        </View>

        {onRetry && reminder.status === 'failed' && reminder.retry_count < reminder.max_retries && (
          <View style={styles.actions}>
            <Card.Actions>
              <Button mode="contained" onPress={() => onRetry(reminder)} compact>
                Retry Now
              </Button>
            </Card.Actions>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorRow: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    fontSize: 12,
  },
  actions: {
    marginTop: 8,
  },
});
