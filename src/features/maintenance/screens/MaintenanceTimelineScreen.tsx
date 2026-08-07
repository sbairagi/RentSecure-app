import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import { MaintenanceTimeline } from '../components';
import type { MaintenanceTimelineEntry } from '../types';

export default function MaintenanceTimelineScreen() {
  const theme = useTheme();
  const _params = useLocalSearchParams<{ id: string }>();

  const activities = useMemo<MaintenanceTimelineEntry[]>(() => [
    {
      id: 1,
      activity_type: 'created',
      description: 'Maintenance request created: Leaking faucet',
      user_name: 'John Doe',
      created_at: new Date().toISOString(),
      metadata: {},
    },
    {
      id: 2,
      activity_type: 'status_changed',
      description: 'Status changed to In Progress',
      user_name: 'Jane Smith',
      created_at: '2026-08-06T00:00:00.000Z',
      metadata: {},
    },
  ], []);

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Timeline</Text>
          <MaintenanceTimeline activities={activities} />
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});
