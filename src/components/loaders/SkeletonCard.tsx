import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export const SkeletonCard: React.FC<{ style?: any }> = ({ style }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        style,
      ]}
    >
      <View style={[styles.shimmer, { backgroundColor: theme.colors.outlineVariant }]} />
    </View>
  );
};

export const SkeletonStatCard: React.FC<{ style?: any }> = ({ style }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        style,
      ]}
    >
      <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant }]} />
      <View style={[styles.shimmerMedium, { backgroundColor: theme.colors.outlineVariant }]} />
    </View>
  );
};

export const SkeletonChart: React.FC<{ style?: any }> = ({ style }) => {
  const theme = useTheme();
  const randomHeights = [40, 70, 55, 90, 65, 80];
  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        style,
      ]}
    >
      <View style={[styles.shimmerMedium, { backgroundColor: theme.colors.outlineVariant }]} />
      <View style={styles.chartBars}>
        {randomHeights.map((h, i) => (
          <View
            key={i}
            style={[
              styles.chartBar,
              {
                backgroundColor: theme.colors.outlineVariant,
                height: h,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{ count?: number; style?: any }> = ({ count = 5, style }) => {
  const theme = useTheme();
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.listItem}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.outlineVariant }]} />
          <View style={styles.listContent}>
            <View
              style={[
                styles.shimmerMedium,
                { backgroundColor: theme.colors.outlineVariant, width: '70%' },
              ]}
            />
            <View
              style={[
                styles.shimmerSmall,
                { backgroundColor: theme.colors.outlineVariant, width: '40%', marginTop: 8 },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  chartCard: {
    height: 220,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  shimmer: {
    height: 20,
    borderRadius: 8,
    width: '60%',
    marginBottom: 12,
  },
  shimmerSmall: {
    height: 12,
    borderRadius: 6,
    width: '40%',
    marginBottom: 8,
  },
  shimmerMedium: {
    height: 16,
    borderRadius: 8,
    width: '80%',
    marginBottom: 12,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
});
