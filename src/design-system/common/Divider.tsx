import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color,
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        {
          backgroundColor: color ?? theme.colors.neutral[200],
          height: orientation === 'horizontal' ? thickness : undefined,
          width: orientation === 'vertical' ? thickness : undefined,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});
