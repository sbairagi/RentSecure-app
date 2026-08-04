import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface LoadingButtonProps {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  testID?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  const theme = useDesignSystemTheme();

  const getBackgroundColor = (): string => {
    if (disabled) return colors.neutral[300];
    switch (variant) {
      case 'primary':
        return theme.colors.primary[600];
      case 'secondary':
        return theme.colors.secondary[500];
      case 'outlined':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return theme.colors.error[500];
      default:
        return theme.colors.primary[600];
    }
  };

  const getTextColor = (): string => {
    if (disabled) return colors.neutral[500];
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return colors.white;
      case 'outlined':
      case 'ghost':
        return theme.colors.primary[600];
      default:
        return colors.white;
    }
  };

  const getPadding = (): number => {
    switch (size) {
      case 'small':
        return spacing.sm;
      case 'medium':
        return spacing.md;
      case 'large':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: getPadding(),
          paddingHorizontal: getPadding() * 2,
          borderRadius: radius.md,
          borderWidth: variant === 'outlined' ? 1.5 : 0,
          borderColor: theme.colors.primary[600],
          opacity: pressed && !disabled ? 0.8 : 1,
        },
        disabled && styles.disabled,
        style,
      ]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        title && (
          <Text
            style={[styles.text, { color: getTextColor(), fontSize: size === 'small' ? 13 : 14 }]}
          >
            {title}
          </Text>
        )
      )}
    </Pressable>
  );
};

LoadingButton.displayName = 'LoadingButton';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
