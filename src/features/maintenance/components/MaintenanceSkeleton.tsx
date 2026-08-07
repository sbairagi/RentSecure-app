import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface MaintenanceSkeletonProps {
  count?: number;
}

export const MaintenanceSkeleton: React.FC<MaintenanceSkeletonProps> = ({ count = 5 }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={styles.header}>
            <View style={[styles.skeletonTitle, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
          </View>
          <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
          <View style={[styles.skeletonLineShort, { backgroundColor: theme.border }]} />
          <View style={[styles.skeletonMeta, { backgroundColor: theme.border }]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  skeletonTitle: {
    height: 18,
    width: '60%',
    borderRadius: 4,
  },
  skeletonBadge: {
    height: 20,
    width: 60,
    borderRadius: 4,
  },
  skeletonLine: {
    height: 14,
    width: '100%',
    borderRadius: 4,
  },
  skeletonLineShort: {
    height: 14,
    width: '40%',
    borderRadius: 4,
  },
  skeletonMeta: {
    height: 12,
    width: '30%',
    borderRadius: 4,
    marginTop: 4,
  },
});
