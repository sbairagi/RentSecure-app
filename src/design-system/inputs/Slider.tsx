import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  error,
  containerStyle,
  disabled = false,
}) => {
  const theme = useDesignSystemTheme();

  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.neutral[700] }]}>{label}</Text>}
      <View style={styles.sliderContainer}>
        <View
          style={[
            styles.track,
            {
              backgroundColor: theme.colors.neutral[200],
            },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${percentage}%`,
                backgroundColor: theme.colors.primary[600],
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            {
              left: `${percentage}%`,
              backgroundColor: theme.colors.primary[600],
            },
          ]}
        />
        <View style={[styles.valueContainer, { backgroundColor: theme.colors.primary[600] }]}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
      {error && <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.sm,
    letterSpacing: 0.25,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: '50%',
    marginTop: -10,
    marginLeft: -10,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  valueContainer: {
    position: 'absolute',
    top: -32,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
