import { useTheme } from '@/hooks/use-theme';
import { View, type ViewProps } from 'react-native';

export type ThemeColor =
  'text' | 'background' | 'backgroundElement' | 'backgroundSelected' | 'textSecondary';

export type ThemedViewProps = ViewProps & {
  _lightColor?: string;
  _darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({
  style,
  _lightColor,
  _darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  const colorMap: Record<string, string> = {
    text: theme.text,
    background: theme.background,
    backgroundElement: theme.backgroundElement,
    backgroundSelected: theme.backgroundSelected,
    textSecondary: theme.textSecondary,
  };

  return (
    <View
      style={[{ backgroundColor: colorMap[type ?? 'background'] || theme.background }, style]}
      {...otherProps}
    />
  );
}
