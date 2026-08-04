import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';
import { Skeleton } from './Skeleton';

export interface DashboardSkeletonProps {
  style?: ViewStyle;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Skeleton width={120} height={24} borderRadius={4} />
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>
      <View style={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: theme.colors.neutral[50] }]}
          >
            <Skeleton
              width={40}
              height={40}
              borderRadius={20}
              style={{ marginBottom: spacing.sm }}
            />
            <Skeleton
              width={60}
              height={20}
              borderRadius={4}
              style={{ marginBottom: spacing.xs }}
            />
            <Skeleton width={40} height={12} borderRadius={4} />
          </View>
        ))}
      </View>
      <View style={styles.chartSection}>
        <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: spacing.md }} />
        <Skeleton width={300} height={200} borderRadius={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
  },
  chartSection: {
    marginBottom: 24,
  },
});
