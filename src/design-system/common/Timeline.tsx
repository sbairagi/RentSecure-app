import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';

export interface TimelineProps {
  items: {
    title: string;
    description?: string;
    timestamp?: string;
    status?: 'completed' | 'pending' | 'failed';
  }[];
  style?: ViewStyle;
}

const statusConfig = {
  completed: { color: colors.success[500], icon: '✓' },
  pending: { color: colors.warning[500], icon: '○' },
  failed: { color: colors.error[500], icon: '✕' },
};

export const Timeline: React.FC<TimelineProps> = ({ items, style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => {
        const status = item.status || 'pending';
        const statusInfo = statusConfig[status];
        const isLast = index === items.length - 1;

        return (
          <View key={index} style={styles.item}>
            <View style={styles.timelineColumn}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: statusInfo.color,
                    borderColor: statusInfo.color,
                  },
                ]}
              >
                <Text style={[styles.dotText, { color: colors.white }]}>{statusInfo.icon}</Text>
              </View>
              {!isLast && (
                <View style={[styles.line, { backgroundColor: theme.colors.neutral[200] }]} />
              )}
            </View>
            <View style={styles.content}>
              <Text style={[styles.title, { color: theme.colors.neutral[900] }]}>{item.title}</Text>
              {item.description && (
                <Text style={[styles.description, { color: theme.colors.neutral[500] }]}>
                  {item.description}
                </Text>
              )}
              {item.timestamp && (
                <Text style={[styles.timestamp, { color: theme.colors.neutral[400] }]}>
                  {item.timestamp}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    flex: 1,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dotText: {
    fontSize: 12,
    fontWeight: '700',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: spacing.xs,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
