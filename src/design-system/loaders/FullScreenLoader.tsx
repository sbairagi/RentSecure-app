import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';

export interface FullScreenLoaderProps {
  message?: string;
  style?: ViewStyle;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = 'Loading...',
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.spinner, { borderTopColor: theme.colors.primary[600] }]} />
      <Text style={[styles.message, { color: theme.colors.neutral[600] }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.neutral[200],
  },
  message: {
    fontSize: 14,
    marginTop: spacing.md,
  },
});
