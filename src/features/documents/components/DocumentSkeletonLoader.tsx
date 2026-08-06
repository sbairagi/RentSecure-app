import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DocumentSkeletonLoaderProps } from '../types';

export const DocumentSkeletonLoader: React.FC<DocumentSkeletonLoaderProps> = ({
  type = 'list',
}) => {
  const theme = useTheme();

  if (type === 'detail') {
    return (
      <View style={styles.container}>
        <View style={[styles.skeletonHeader, { backgroundColor: Colors.skeleton }]} />
        <View style={styles.skeletonContent}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.skeletonRow, { backgroundColor: Colors.skeleton }]} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {[...Array(4)].map((_, i) => (
        <View
          key={i}
          style={[styles.skeletonCard, { backgroundColor: Colors.skeleton }]}
        >
          <View style={[styles.skeletonLine, { backgroundColor: Colors.skeletonShine }]} />
          <View style={[styles.skeletonLineShort, { backgroundColor: Colors.skeletonShine }]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  skeletonCard: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    height: 100,
  },
  skeletonHeader: {
    height: 200,
    borderRadius: 12,
    margin: Spacing.md,
  },
  skeletonContent: {
    padding: Spacing.md,
  },
  skeletonRow: {
    height: 16,
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    width: '70%',
  },
  skeletonLineShort: {
    height: 16,
    borderRadius: 4,
    width: '40%',
  },
});
