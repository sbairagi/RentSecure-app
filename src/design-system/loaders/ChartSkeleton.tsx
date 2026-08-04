import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';
import { Skeleton } from './Skeleton';

export interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie';
  style?: ViewStyle;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ type = 'bar', style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral[50] }, style]}>
      <Skeleton width={120} height={18} borderRadius={4} style={{ marginBottom: spacing.md }} />
      <View style={styles.chartArea}>
        {type === 'bar' && (
          <View style={styles.barChart}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                width={32}
                height={index % 2 === 0 ? 120 : 80}
                borderRadius={8}
              />
            ))}
          </View>
        )}
        {type === 'line' && <Skeleton width={300} height={200} borderRadius={12} />}
        {type === 'pie' && (
          <View style={styles.pieChart}>
            <Skeleton width={150} height={150} borderRadius={75} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  chartArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
    width: '100%',
  },
  pieChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
