import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = 24;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING * 2;

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  data: BarData[];
  height?: number;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, height = 200 }) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(() => 0);

  useEffect(() => {
    let frameId: number;
    let currentProgress = 0;

    const animate = () => {
      currentProgress += 0.02;
      if (currentProgress >= 1) {
        setProgress(1);
        return;
      }
      setProgress(currentProgress);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [data]);

  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);
  const chartHeight = height - 40;
  const barWidth = useMemo(
    () => (CHART_WIDTH - (data.length - 1) * 8) / Math.max(data.length, 1),
    [data.length]
  );

  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.emptyChart}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        {data.map((item) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const animatedHeight = barHeight * progress;
          const barColor = item.color || theme.colors.primary;
          return (
            <View key={item.label} style={styles.barWrapper}>
              <Text style={[styles.valueLabel, { color: theme.colors.onSurface }]}>
                {Math.round(item.value * progress)}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: animatedHeight,
                    backgroundColor: barColor,
                    borderRadius: barWidth / 2,
                  },
                ]}
              />
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: CHART_PADDING,
    paddingTop: 16,
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    maxHeight: '100%',
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
