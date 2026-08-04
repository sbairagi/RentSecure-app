import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { useDesignSystemTheme } from '../theme';

export type TypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'overline'
  | 'buttonText'
  | 'label';

export interface TypographyProps extends RNTextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  style?: TextStyle;
  allowFontScaling?: boolean;
  maxFontSizeMultiplier?: number;
}

const variantStyles: Record<TypographyVariant, TextStyle> = {
  displayLarge: {
    fontSize: 48,
    lineHeight: 60,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.25,
  },
  heading1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.25,
  },
  heading2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: 0,
  },
  heading3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = 1.2,
  ...rest
}) => {
  const theme = useDesignSystemTheme();

  return (
    <RNText
      style={[{ color: theme.colors.neutral[900] }, variantStyles[variant], style]}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    >
      {children}
    </RNText>
  );
};

Typography.displayName = 'Typography';

export const styles = StyleSheet.create({});
