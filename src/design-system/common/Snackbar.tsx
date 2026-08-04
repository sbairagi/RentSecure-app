import React, { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface SnackbarProps {
  message: string;
  action?: { label: string; onPress: () => void };
  duration?: number;
  onHide?: () => void;
  style?: ViewStyle;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  action,
  duration = 4000,
  onHide,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const translateY = useMemo(() => new Animated.Value(100), []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide?.());
  }, [translateY, duration, onHide]);

  return (
    <Animated.View
      style={[
        styles.snackbar,
        {
          backgroundColor: theme.colors.neutral[800],
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <Text style={[styles.message, { color: colors.white }]}>{message}</Text>
      {action && (
        <Text
          style={[styles.action, { color: theme.colors.primary[300] }]}
          onPress={action.onPress}
        >
          {action.label}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
});
