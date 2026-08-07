import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';
import type { MaintenanceTimelineEntry } from '../types';

interface MaintenanceTimelineProps {
  activities: MaintenanceTimelineEntry[];
}

export const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ activities }) => {
  const theme = useTheme();

  if (!activities || activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No timeline events yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activities.map((activity, index) => {
        const label = MAINTENANCE_CONSTANTS.ACTIVITY_TYPE_LABELS[activity.activity_type] || activity.activity_type;
        const isLast = index === activities.length - 1;

        return (
          <View key={activity.id} style={styles.item}>
            <View style={styles.leftColumn}>
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              {!isLast && <View style={[styles.line, { backgroundColor: theme.border }]} />}
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.title, { color: theme.text }]}>{label}</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                {activity.description}
              </Text>
              {activity.user_name && (
                <Text style={[styles.user, { color: theme.textSecondary }]}>
                  by {activity.user_name}
                </Text>
              )}
              <Text style={[styles.date, { color: theme.textSecondary }]}>
                {new Date(activity.created_at).toLocaleString()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  leftColumn: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  rightColumn: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
  user: {
    fontSize: 12,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
