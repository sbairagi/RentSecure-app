import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  onPress?: () => void;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  onPress,
  style,
}) => {
  const theme = useTheme();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'success':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.error;
      default:
        return theme.primary;
    }
  };

  const getPadding = (): number => {
    switch (size) {
      case 'small':
        return 4;
      case 'medium':
        return 8;
      default:
        return 8;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return FontSizes.xs;
      case 'medium':
        return FontSizes.sm;
      default:
        return FontSizes.sm;
    }
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: getPadding() * 2,
          paddingVertical: getPadding(),
          borderRadius: 100,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: Colors.white,
            fontSize: getFontSize(),
            fontWeight: FontWeights.semibold,
          },
        ]}
      >
        {label}
      </Text>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
});
