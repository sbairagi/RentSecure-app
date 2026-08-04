import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { iconSizes, radius } from '../tokens';

export interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const getSize = (size: IconButtonProps['size']): number => {
  switch (size) {
    case 'small':
      return 36;
    case 'medium':
      return 44;
    case 'large':
      return 56;
    default:
      return 44;
  }
};

const getIconSize = (size: IconButtonProps['size']): number => {
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

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  size = 'medium',
  variant = 'ghost',
  disabled = false,
  style,
  testID,
}) => {
  const theme = useDesignSystemTheme();
  const containerSize = getSize(size);
  const _iconSize = getIconSize(size);

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
        styles.button,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: radius.md,
          backgroundColor,
        },
        variant === 'outlined' && {
          borderWidth: 1.5,
          borderColor: theme.colors.primary[600],
        },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      testID={testID}
    >
      {icon}
    </Pressable>
  );
};

IconButton.displayName = 'IconButton';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
