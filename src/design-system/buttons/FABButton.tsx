import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, iconSizes, radius, spacing } from '../tokens';

export interface FABButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const FABButton: React.FC<FABButtonProps> = ({
  onPress,
  icon,
  label,
  variant = 'primary',
  disabled = false,
  style,
  testID,
}) => {
  const theme = useDesignSystemTheme();

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary[600]
      : variant === 'secondary'
        ? theme.colors.neutral[100]
        : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor,
          borderRadius: radius.full,
          borderColor: variant === 'outlined' ? theme.colors.primary[600] : 'transparent',
          borderWidth: variant === 'outlined' ? 1.5 : 0,
        },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      testID={testID}
    >
      {icon && (
        <Text
          style={[
            styles.icon,
            { color: variant === 'outlined' ? theme.colors.primary[600] : colors.white },
          ]}
        >
          {icon}
        </Text>
      )}
      {label && (
        <Text
          style={[
            styles.label,
            { color: variant === 'outlined' ? theme.colors.primary[600] : colors.white },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

FABButton.displayName = 'FABButton';

const styles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  icon: {
    fontSize: iconSizes.lg,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
