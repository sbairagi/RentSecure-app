import React, { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, iconSizes, radius, spacing } from '../tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonFull = boolean;

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: ButtonFull;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const getBackgroundColor = (
  variant: ButtonVariant,
  theme: ReturnType<typeof useDesignSystemTheme>
): string => {
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
    case 'success':
      return theme.colors.success[500];
    default:
      return theme.colors.primary[600];
  }
};

const getTextColor = (variant: ButtonVariant, disabled: boolean): string => {
  if (disabled) return colors.neutral[400];
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'danger':
    case 'success':
      return colors.white;
    case 'outlined':
    case 'ghost':
      return colors.primary[600];
    default:
      return colors.white;
  }
};

const getBorderColor = (
  variant: ButtonVariant,
  theme: ReturnType<typeof useDesignSystemTheme>
): string => {
  if (variant === 'outlined') return theme.colors.primary[600];
  return 'transparent';
};

const getPadding = (size: ButtonSize): number => {
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

const getFontSize = (size: ButtonSize): number => {
  switch (size) {
    case 'small':
      return 13;
    case 'medium':
      return 14;
    case 'large':
      return 16;
    default:
      return 14;
  }
};

const getIconSize = (size: ButtonSize): number => {
  switch (size) {
    case 'small':
      return iconSizes.sm;
    case 'medium':
      return iconSizes.md;
    case 'large':
      return iconSizes.lg;
    default:
      return iconSizes.md;
  }
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  icon,
  style,
  textStyle,
  testID,
}) => {
  const theme = useDesignSystemTheme();
  const backgroundColor = getBackgroundColor(variant, theme);
  const textColor = getTextColor(variant, disabled);
  const borderColor = getBorderColor(variant, theme);
  const padding = getPadding(size);
  const fontSize = getFontSize(size);
  const iconSize = getIconSize(size);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          paddingVertical: padding,
          paddingHorizontal: padding * 2,
          borderRadius: radius.md,
          borderWidth: variant === 'outlined' ? 1.5 : 0,
          opacity: pressed && !disabled ? 0.8 : 1,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon && (
            <Text style={[styles.icon, { fontSize: iconSize, color: textColor }]}>{leftIcon}</Text>
          )}
          {icon && (
            <Text style={[styles.icon, { fontSize: iconSize, color: textColor }]}>{icon}</Text>
          )}
          {title && (
            <Text
              style={[
                styles.text,
                {
                  color: textColor,
                  fontSize,
                  marginLeft: leftIcon || icon ? spacing.sm : 0,
                  marginRight: rightIcon ? spacing.sm : 0,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {rightIcon && (
            <Text style={[styles.icon, { fontSize: iconSize, color: textColor }]}>{rightIcon}</Text>
          )}
        </>
      )}
    </Pressable>
  );
};

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});
