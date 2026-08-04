import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  height?: number;
  style?: ViewStyle;
}

const variantConfig = {
  primary: colors.primary[600],
  secondary: colors.neutral[600],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  label,
  height = 8,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = variantConfig[variant];

  return (
    <View style={style}>
      {(label || showLabel) && (
        <View style={styles.labelRow}>
          {label && (
            <Text style={[styles.label, { color: theme.colors.neutral[700] }]}>{label}</Text>
          )}
          {showLabel && (
            <Text style={[styles.percentage, { color: theme.colors.neutral[500] }]}>
              {Math.round(percentage)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.neutral[200],
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
