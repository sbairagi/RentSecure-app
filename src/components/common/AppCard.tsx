import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { TouchableOpacity, View, type ViewStyle } from 'react-native';

interface AppCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  margin = 'md',
  onPress,
  style,
  testID,
}) => {
  const theme = useTheme();

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return Spacing.sm;
      case 'md':
        return Spacing.md;
      case 'lg':
        return Spacing.lg;
      default:
        return Spacing.md;
    }
  };

  const getMargin = (): number => {
    switch (margin) {
      case 'none':
        return 0;
      case 'sm':
        return Spacing.sm;
      case 'md':
        return Spacing.md;
      case 'lg':
        return Spacing.lg;
      default:
        return Spacing.md;
    }
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      padding: getPadding(),
      margin: getMargin(),
      backgroundColor: theme.card,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          elevation: 3,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.backgroundElement,
        };
      default:
        return baseStyle;
    }
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      testID={testID}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[getCardStyle(), style]}
    >
      {children}
    </CardWrapper>
  );
};
