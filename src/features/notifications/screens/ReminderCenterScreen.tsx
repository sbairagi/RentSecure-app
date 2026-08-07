import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ReminderCard } from '../components/ReminderCard';
import { NotificationEmptyState } from '../components/NotificationEmptyState';
import { useReminders, useReminderStats } from '../hooks';
import type { Reminder } from '../types';

export default function ReminderCenterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [filters] = useState<Record<string, never>>({});
  const [page] = useState(1);

  const { reminders, isLoading } = useReminders(filters, page, 20);
  const { stats } = useReminderStats();

  const handleReminderPress = useCallback((_reminder: Reminder) => {
    // Navigate to reminder details if needed
  }, []);

  const handleRetry = useCallback((_reminder: Reminder) => {
    // Retry logic
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading reminders...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Reminder Center
        </Text>
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Total
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: '#059669' }]}>{stats.sent}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Sent
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>{stats.failed}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Failed
            </Text>
          </View>
        </View>
      )}

      {reminders.length === 0 ? (
        <NotificationEmptyState
          title="No reminders"
          message="Reminders will appear here when scheduled"
        />
      ) : (
        <View style={styles.listContainer}>
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onPress={handleReminderPress}
              onRetry={handleRetry}
            />
          ))}
        </View>
      )}
    </View>
  );
};

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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  listContainer: {
    paddingTop: 8,
  },
});
