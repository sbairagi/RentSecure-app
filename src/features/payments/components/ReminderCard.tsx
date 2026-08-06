import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { PaymentReminder } from '../types/reminders';
import { formatDateTime } from '../utils/paymentUtils';

interface ReminderCardProps {
  reminder: PaymentReminder;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder }) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    if (status === 'sent' || status === 'delivered') return '#059669';
    if (status === 'failed') return '#DC2626';
    if (status === 'pending') return '#D97706';
    return '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'sent' || status === 'delivered') return 'Sent';
    if (status === 'failed') return 'Failed';
    if (status === 'pending') return 'Pending';
    return status;
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {reminder.reminder_type === 'whatsapp' ? '💬' :
             reminder.reminder_type === 'email' ? '📧' :
             reminder.reminder_type === 'sms' ? '📱' : '🔔'}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.type, { color: theme.colors.onSurface }]}>
            {reminder.reminder_type.toUpperCase()}
          </Text>
          <Text style={[styles.recipient, { color: theme.colors.onSurfaceVariant }]}>
            To: {reminder.recipient}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(reminder.status)}15` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(reminder.status) }]}>
            {getStatusLabel(reminder.status)}
          </Text>
        </View>
      </View>

      {reminder.message && (
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
          {reminder.message}
        </Text>
      )}

      <Text style={[styles.timestamp, { color: theme.colors.onSurfaceVariant }]}>
        {formatDateTime(reminder.sent_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recipient: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  message: {
    fontSize: 13,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
  },
});
