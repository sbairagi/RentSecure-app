import { Colors, FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) => {
  const theme = useTheme();

  const getBackgroundColor = (): string => {
    if (disabled) return Colors.gray300;
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return Colors.error;
      default:
        return theme.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return Colors.gray500;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return Colors.white;
      case 'outline':
      case 'ghost':
        return theme.primary;
      default:
        return Colors.white;
    }
  };

  const getPadding = (): number => {
    switch (size) {
      case 'small':
        return Spacing.sm;
      case 'medium':
        return Spacing.md;
      case 'large':
        return Spacing.lg;
      default:
        return Spacing.md;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return FontSizes.sm;
      case 'medium':
        return FontSizes.md;
      case 'large':
        return FontSizes.lg;
      default:
        return FontSizes.md;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: getPadding(),
          paddingHorizontal: getPadding() * 2,
          borderRadius: Radius.md,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: theme.primary,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: FontWeights.semibold,
                marginLeft: leftIcon ? Spacing.sm : 0,
                marginRight: rightIcon ? Spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    textAlign: 'center',
  },
});
