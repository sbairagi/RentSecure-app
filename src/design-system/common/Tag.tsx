import React from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius } from '../tokens';

export interface TagProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantConfig = {
  primary: { bg: colors.primary[600], text: colors.white, border: 'transparent' },
  secondary: { bg: colors.neutral[100], text: colors.neutral[700], border: colors.neutral[200] },
  outlined: { bg: 'transparent', text: colors.neutral[700], border: colors.neutral[300] },
};

const sizeConfig = {
  small: { padding: 4, fontSize: 11 },
  medium: { padding: 6, fontSize: 12 },
};

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'secondary',
  size = 'medium',
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  const _theme = useDesignSystemTheme();
  const colorsVariant = variantConfig[variant];
  const sizeVariant = sizeConfig[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.tag,
        {
          backgroundColor: colorsVariant.bg,
          borderColor: colorsVariant.border,
          paddingHorizontal: sizeVariant.padding * 2,
          paddingVertical: sizeVariant.padding,
          borderRadius: radius.full,
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colorsVariant.text,
            fontSize: sizeVariant.fontSize,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '500',
  },
});
