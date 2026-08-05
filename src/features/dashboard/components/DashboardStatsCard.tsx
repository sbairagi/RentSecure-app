import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface Trend {
  value: number;
  isUp: boolean;
}

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
  trend?: Trend;
}

export const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const theme = useTheme();
  const cardColor = color || theme.colors.primary;

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toString();
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${cardColor}15` }]}>
            <Text style={styles.icon}>{icon || '📊'}</Text>
          </View>
          {trend && (
            <View
              style={[
                styles.trendBadge,
                {
                  backgroundColor: trend.isUp
                    ? `${theme.colors.primary}15`
                    : `${theme.colors.error}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.trendText,
                  { color: trend.isUp ? theme.colors.primary : theme.colors.error },
                ]}
              >
                {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
              </Text>
            </View>
          )}
        </View>
        <Text variant="headlineSmall" style={[styles.value, { color: theme.colors.onSurface }]}>
          {formatValue(value)}
        </Text>
        <Text variant="bodySmall" style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
  },
});
