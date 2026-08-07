import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ActivityHistoryScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const timeline = [
    { id: 1, action: 'created', description: 'Caretaker record created', timestamp: '2025-01-15T10:00:00Z', user: 'owner' },
  ];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Activity History</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>
              Caretaker #{id} activity log is not yet exposed by the backend.
            </Text>
            <View style={styles.timeline}>
              {timeline.map((item) => (
                <View key={item.id} style={styles.timelineItem}>
                  <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                  <View style={styles.timelineContent}>
                    <Text style={[styles.action, { color: theme.text }]}>{item.action}</Text>
                    <Text style={[styles.description, { color: theme.subText }]}>
                      {item.description}
                    </Text>
                    <Text style={[styles.meta, { color: theme.subText }]}>
                      {new Date(item.timestamp).toLocaleString()} by {item.user}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  timeline: {
    gap: 16,
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    gap: 2,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontSize: 11,
  },
});
