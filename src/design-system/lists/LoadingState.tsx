import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title,
  subtitle,
  size = 'large',
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={theme.colors.primary[600]} />
      {title && <Text style={[styles.title, { color: theme.colors.neutral[700] }]}>{title}</Text>}
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.neutral[500] }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
});
