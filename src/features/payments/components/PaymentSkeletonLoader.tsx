import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SkeletonCard, SkeletonStatCard } from '@/components/loaders/SkeletonCard';

export const PaymentSkeletonLoader: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.shimmer, { backgroundColor: theme.colors.outlineVariant }]} />
            <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant }]} />
          </View>
          <View style={styles.body}>
            <View style={[styles.shimmerMedium, { backgroundColor: theme.colors.outlineVariant }]} />
            <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant, width: '60%' }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

export const PaymentSkeletonCard: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.shimmer, { backgroundColor: theme.colors.outlineVariant }]} />
        <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant }]} />
      </View>
      <View style={styles.body}>
        <View style={[styles.shimmerMedium, { backgroundColor: theme.colors.outlineVariant }]} />
        <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant, width: '60%' }]} />
      </View>
    </View>
  );
};

export const PaymentAnalyticsSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={styles.analyticsContainer}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        ]}
      >
        <View style={[styles.shimmerMedium, { backgroundColor: theme.colors.outlineVariant }]} />
        <View style={styles.chartBars}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.chartBar,
                { backgroundColor: theme.colors.outlineVariant, height: 40 + Math.random() * 60 },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  body: {
    gap: 8,
  },
  shimmer: {
    height: 18,
    borderRadius: 8,
    width: '50%',
  },
  shimmerSmall: {
    height: 12,
    borderRadius: 6,
    width: '30%',
  },
  shimmerMedium: {
    height: 16,
    borderRadius: 8,
    width: '80%',
  },
  analyticsContainer: {
    padding: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    paddingTop: 16,
  },
  chartBar: {
    width: 12,
    borderRadius: 6,
  },
});
