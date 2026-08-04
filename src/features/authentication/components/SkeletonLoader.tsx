import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface SkeletonLoaderProps {
  count?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.skeleton,
            {
              backgroundColor: theme.backgroundElement,
              marginBottom: index < count - 1 ? Spacing.md : 0,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  skeleton: {
    height: 20,
    borderRadius: 4,
    width: '100%',
  },
});
