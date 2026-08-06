import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { UnitTimelineEntry } from '../types/units';

interface UnitTimelineProps {
  timeline: UnitTimelineEntry[];
}

export const UnitTimeline: React.FC<UnitTimelineProps> = ({ timeline }) => {
  const theme = useTheme();

  if (timeline.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.emptyText, { color: theme.subText }]}>No timeline events yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {timeline.map((entry, index) => (
        <View key={entry.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            {index < timeline.length - 1 && (
              <View style={[styles.line, { backgroundColor: theme.border }]} />
            )}
          </View>
          <View style={styles.timelineContent}>
            <Text style={[styles.action, { color: theme.text }]}>{entry.action}</Text>
            <Text style={[styles.description, { color: theme.subText }]}>{entry.description}</Text>
            <Text style={[styles.timestamp, { color: theme.subText }]}>
              {new Date(entry.timestamp).toLocaleString()}
            </Text>
            <Text style={[styles.user, { color: theme.subText }]}>By {entry.user}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 2,
  },
  user: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
