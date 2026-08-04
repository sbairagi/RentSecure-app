import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius } from '../tokens';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantConfig = {
  primary: { bg: colors.primary[100], text: colors.primary[700] },
  secondary: { bg: colors.neutral[100], text: colors.neutral[700] },
  success: { bg: colors.success[100], text: colors.success[700] },
  warning: { bg: colors.warning[100], text: colors.warning[600] },
  error: { bg: colors.error[100], text: colors.error[700] },
  neutral: { bg: colors.neutral[100], text: colors.neutral[600] },
};

const sizeConfig = {
  small: { padding: 4, fontSize: 11 },
  medium: { padding: 6, fontSize: 12 },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const _theme = useDesignSystemTheme();
  const colorsVariant = variantConfig[variant];
  const sizeVariant = sizeConfig[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colorsVariant.bg,
          paddingHorizontal: sizeVariant.padding * 2,
          paddingVertical: sizeVariant.padding,
          borderRadius: radius.full,
        },
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
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.25,
  },
});
