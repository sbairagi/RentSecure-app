import { FontSizes } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { Text as RNText, StyleSheet, TextProps, TextStyle } from 'react-native';

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'link';
  color?: string;
  style?: TextStyle;
}

export const AppText: React.FC<AppTextProps> = ({ variant = 'body', color, style, ...rest }) => {
  const theme = useTheme();

  const getFontSize = (): number => {
    switch (variant) {
      case 'h1':
        return FontSizes.huge;
      case 'h2':
        return FontSizes.xxxl;
      case 'h3':
        return FontSizes.xxl;
      case 'h4':
        return FontSizes.xl;
      case 'body':
        return FontSizes.md;
      case 'caption':
        return FontSizes.sm;
      case 'link':
        return FontSizes.md;
      default:
        return FontSizes.md;
    }
  };

  const getFontWeight = (): '400' | '500' | '600' | '700' | '800' => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
        return '700';
      case 'h4':
        return '600';
      case 'link':
        return '500';
      default:
        return '400';
    }
  };

  const textColor = color || (variant === 'link' ? theme.primary : theme.text);

  return (
    <RNText
      style={[
        styles.text,
        {
          color: textColor,
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
          lineHeight: getFontSize() * 1.4,
        } as TextStyle,
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },
});
