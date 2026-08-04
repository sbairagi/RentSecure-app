import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface ChartProps {
  data: { label: string; value: number; color?: string }[];
  type?: 'bar';
  height?: number;
  style?: ViewStyle;
}

export const Chart: React.FC<ChartProps> = ({ data, type = 'bar', height = 200, style }) => {
  const theme = useDesignSystemTheme();
  const maxValue = Math.max(...data.map((d) => d.value));
  const _barWidth = 32;
  const chartPadding = 20;

  if (type === 'bar') {
    return (
      <View style={[styles.container, { height }, style]}>
        <View style={styles.chartArea}>
          {data.map((item, index) => {
            const barHeight =
              maxValue > 0 ? (item.value / maxValue) * (height - chartPadding * 2) : 0;
            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.color || theme.colors.primary[600],
                    },
                  ]}
                />
                <Text
                  style={[styles.label, { color: theme.colors.neutral[500] }]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingHorizontal: spacing.sm,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
