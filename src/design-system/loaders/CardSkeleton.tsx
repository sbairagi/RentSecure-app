import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';
import { Skeleton } from './Skeleton';

export interface CardSkeletonProps {
  style?: ViewStyle;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.neutral[50] }, style]}>
      <Skeleton width={60} height={18} borderRadius={4} style={{ marginBottom: spacing.sm }} />
      <Skeleton width={200} height={14} borderRadius={4} style={{ marginBottom: spacing.xs }} />
      <Skeleton width={160} height={14} borderRadius={4} style={{ marginBottom: spacing.md }} />
      <View style={styles.row}>
        <Skeleton width={60} height={40} borderRadius={8} />
        <Skeleton width={60} height={40} borderRadius={8} />
        <Skeleton width={60} height={40} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
