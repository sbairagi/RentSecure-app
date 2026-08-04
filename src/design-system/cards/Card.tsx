import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, shadows, spacing } from '../tokens';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'filled';
  disabled?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  contentStyle,
  variant = 'elevated',
  disabled = false,
  testID,
}) => {
  const theme = useDesignSystemTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.neutral[50],
      borderRadius: radius.lg,
    },
    variant === 'elevated' && shadows.md,
    variant === 'outlined' && {
      borderWidth: 1,
      borderColor: theme.colors.neutral[200],
    },
    variant === 'filled' && {
      backgroundColor: theme.colors.neutral[100],
    },
    disabled && { opacity: 0.6 },
    style,
  ];

  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [...cardStyle, pressed && !disabled && styles.pressed]}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {content}
    </View>
  );
};

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.95,
  },
});
