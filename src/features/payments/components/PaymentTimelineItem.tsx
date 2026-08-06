import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { PaymentTimelineEntry } from '../types/payments';
import { formatDateTime } from '../utils/paymentUtils';

interface PaymentTimelineItemProps {
  entry: PaymentTimelineEntry;
}

export const PaymentTimelineItem: React.FC<PaymentTimelineItemProps> = ({ entry }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
      <View style={[styles.content, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {entry.action}
        </Text>
        <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
          {entry.description}
        </Text>
        <Text style={[styles.timestamp, { color: theme.colors.onSurfaceVariant }]}>
          {formatDateTime(entry.timestamp)} by {entry.user}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 13,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
});
