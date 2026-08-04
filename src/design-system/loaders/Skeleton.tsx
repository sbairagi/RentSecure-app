import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';

export interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 200,
  height = 16,
  borderRadius,
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius ?? 8,
          backgroundColor: theme.colors.neutral[200],
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
