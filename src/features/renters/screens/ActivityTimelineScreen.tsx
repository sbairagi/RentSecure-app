import { Spacing } from '@/constants/theme';
import { TimelineItem } from '@/features/renters/components/TimelineItem';
import { useRenterTimeline } from '@/features/renters/hooks/useRenterTimeline';
import type { TimelineItemProps } from '@/features/renters/types';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function ActivityTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { timeline, isLoading } = useRenterTimeline(Number(id));

  const mappedTimeline: TimelineItemProps['item'][] = (timeline || []).map((entry) => ({
    id: entry.id,
    title: entry.action,
    description: entry.description,
    timestamp: entry.timestamp,
    icon: entry.action.toLowerCase().replace(/\s+/g, '-'),
  }));

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Activity Timeline</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : mappedTimeline && mappedTimeline.length > 0 ? (
          mappedTimeline.map((item) => <TimelineItem key={item.id} item={item} />)
        ) : (
          <Text style={styles.emptyText}>No activity recorded yet.</Text>
        )}
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: '#6b7280',
  },
});
