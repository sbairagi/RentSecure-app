import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { DeliveryLog } from '../types';

interface DeliveryTimelineProps {
  logs: DeliveryLog[];
}

export const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({ logs }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Delivery Timeline</Text>
      {logs.map((log, index) => (
        <View key={log.id || index} style={styles.item}>
          <View style={styles.timelineContainer}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    log.status === 'delivered' || log.status === 'sent'
                      ? '#059669'
                      : log.status === 'failed'
                      ? '#DC2626'
                      : '#D97706',
                },
              ]}
            />
            {index < logs.length - 1 && (
              <View style={[styles.line, { backgroundColor: theme.colors.outlineVariant }]} />
            )}
          </View>
          <View style={styles.content}>
            <Text style={[styles.channel, { color: theme.colors.onSurface }]}>
              {log.channel?.toUpperCase()}
            </Text>
            <Text style={[styles.status, { color: theme.colors.onSurfaceVariant }]}>
              {log.status?.toUpperCase()}
            </Text>
            <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>
              {log.sent_at}
            </Text>
            {log.error_message && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {log.error_message}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 12,
    bottom: -16,
    width: 2,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  channel: {
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
