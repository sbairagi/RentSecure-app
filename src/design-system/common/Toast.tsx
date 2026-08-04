import React, { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onHide?: () => void;
  style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onHide,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const translateY = useMemo(() => new Animated.Value(-100), []);

  const typeConfig = {
    info: { bg: theme.colors.info[500], icon: 'ℹ️' },
    success: { bg: theme.colors.success[500], icon: '✓' },
    warning: { bg: theme.colors.warning[500], icon: '⚠' },
    error: { bg: theme.colors.error[500], icon: '✕' },
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide?.());
  }, [translateY, duration, onHide]);

  const config = typeConfig[type];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.bg,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    gap: spacing.sm,
  },
  icon: {
    fontSize: 16,
  },
  message: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
