import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonList } from '@/components/loaders/SkeletonCard';

export const NotificationSkeletonLoader: React.FC<{ count?: number }> = ({ count = 5 }) => {

  return (
    <View style={styles.container}>
      <SkeletonList count={count} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
