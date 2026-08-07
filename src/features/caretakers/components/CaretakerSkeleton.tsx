import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CaretakerSkeletonProps {
  count?: number;
}

export const CaretakerSkeleton: React.FC<CaretakerSkeletonProps> = ({ count = 5 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonHeaderText}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
            </View>
            <View style={styles.skeletonBadge} />
          </View>
          <View style={styles.skeletonDetails}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  skeletonHeaderText: {
    flex: 1,
    gap: 6,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  skeletonLineShort: {
    width: '60%',
  },
  skeletonBadge: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  skeletonDetails: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
});
