import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { useDesignSystemTheme } from '../theme';
import { colors } from '../tokens';

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  style?: ViewStyle;
}

const variantConfig = {
  primary: colors.primary[600],
  secondary: colors.neutral[600],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  label,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const barColor = variantConfig[variant];

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle
          stroke={theme.colors.neutral[200]}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={barColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.percentage, { color: theme.colors.neutral[900] }]}>
            {Math.round(percentage)}%
          </Text>
          {label && (
            <Text style={[styles.label, { color: theme.colors.neutral[500] }]} numberOfLines={1}>
              {label}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
