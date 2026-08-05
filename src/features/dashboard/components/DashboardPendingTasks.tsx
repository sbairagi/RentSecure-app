import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { PendingTasks } from '../types/dashboard';

interface DashboardPendingTasksProps {
  tasks: PendingTasks | null;
  isLoading?: boolean;
}

export const DashboardPendingTasks: React.FC<DashboardPendingTasksProps> = ({
  tasks,
  isLoading = false,
}) => {
  const theme = useTheme();
  const router = useRouter();

  if (isLoading || !tasks) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Pending Tasks</Text>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading tasks...</Text>
        </View>
      </View>
    );
  }

  const taskItems = [
    {
      label: 'Rent Due Today',
      count: tasks.rent_due_today.length,
      icon: '💰',
      color: '#DC2626',
      path: '/(drawer)/(tabs)/payments',
    },
    {
      label: 'Agreements Expiring',
      count: tasks.agreements_expiring.length,
      icon: '📄',
      color: '#D97706',
      path: '/(drawer)/(tabs)/agreements',
    },
    {
      label: 'Pending Verification',
      count: tasks.pending_verification,
      icon: '🔍',
      color: '#7C3AED',
      path: '/(drawer)/(tabs)/properties',
    },
    {
      label: 'Maintenance Requests',
      count: tasks.maintenance_requests?.length || 0,
      icon: '🔧',
      color: '#059669',
      path: '/(drawer)/(tabs)/properties',
    },
    {
      label: 'Pending Payouts',
      count: tasks.pending_payouts.length,
      icon: '💸',
      color: '#0891B2',
      path: '/(drawer)/(tabs)/payments',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Pending Tasks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {taskItems.map((task, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(task.path)}
            style={[
              styles.taskCard,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
            ]}
          >
            <View style={[styles.taskIcon, { backgroundColor: `${task.color}15` }]}>
              <Text style={styles.taskIconText}>{task.icon}</Text>
            </View>
            <Text
              variant="bodySmall"
              style={[styles.taskLabel, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {task.label}
            </Text>
            {task.count > 0 && (
              <View style={[styles.badge, { backgroundColor: task.color }]}>
                <Text style={styles.badgeText}>{task.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  taskCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskIconText: {
    fontSize: 20,
  },
  taskLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
