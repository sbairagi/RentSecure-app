import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { spacing } from '../tokens';
import { Skeleton } from './Skeleton';

export interface ListSkeletonProps {
  count?: number;
  style?: ViewStyle;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 3, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.item}>
          <Skeleton width={48} height={48} borderRadius={24} style={{ marginRight: spacing.md }} />
          <View style={styles.content}>
            <Skeleton
              width={60}
              height={16}
              borderRadius={4}
              style={{ marginBottom: spacing.xs }}
            />
            <Skeleton width={40} height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
});
