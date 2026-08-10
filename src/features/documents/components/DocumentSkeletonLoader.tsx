import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export const DocumentSkeletonLoader: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={[styles.skeleton, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.skeletonIcon, { backgroundColor: theme.border }]} />
          <View style={styles.skeletonText}>
            <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonLineShort, { backgroundColor: theme.border }]} />
          </View>
        </View>
      ))}
      <ActivityIndicator size="large" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  skeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: Spacing.md,
  },
  skeletonText: {
    flex: 1,
    gap: Spacing.sm,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 4,
    width: '80%',
  },
  skeletonLineShort: {
    height: 10,
    borderRadius: 4,
    width: '40%',
  },
  loader: {
    marginTop: Spacing.lg,
  },
});
