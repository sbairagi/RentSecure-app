import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { G, Path, Svg, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = 24;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING * 2;
const CHART_HEIGHT = 200;

interface ChartPoint {
  label: string;
  value: number;
}

interface AnimatedLineChartProps {
  data: ChartPoint[];
  color?: string;
  height?: number;
  showDots?: boolean;
  animated?: boolean;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  color = '#2563EB',
  height = CHART_HEIGHT,
  showDots = true,
  animated = true,
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(() => (animated ? 0 : 1));

  useEffect(() => {
    if (!animated) return;

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
  }, [animated, data]);

  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);
  const minValue = useMemo(() => Math.min(...data.map((d) => d.value), 0), [data]);
  const range = maxValue - minValue || 1;

  const points = useMemo(() => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1 || 1)) * (CHART_WIDTH - 40) + 20;
      const y = height - 40 - ((point.value - minValue) / range) * (height - 80);
      return { x, y, value: point.value, label: point.label };
    });
  }, [data, minValue, range, height]);

  const animatedPoints = useMemo(() => {
    return points.map((point) => {
      const animatedY = height - 40 - ((point.value - minValue) / range) * (height - 80) * progress;
      return { ...point, animatedY };
    });
  }, [points, progress, minValue, range, height]);

  const animatedPathString = useMemo(() => {
    return animatedPoints.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.animatedY}`;
      const prev = animatedPoints[index - 1];
      const xc = (point.x + prev.x) / 2;
      const yc = (point.animatedY + prev.animatedY) / 2;
      return `${acc} Q ${prev.x} ${prev.animatedY} ${xc} ${yc}`;
    }, '');
  }, [animatedPoints]);

  const fillPathString = useMemo(() => {
    const lastX = animatedPoints[animatedPoints.length - 1]?.x || 0;
    const firstX = animatedPoints[0]?.x || 0;
    return `${animatedPathString} L ${lastX} ${height - 20} L ${firstX} ${height - 20} Z`;
  }, [animatedPathString, animatedPoints, height]);

  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.emptyChart}>
          <SvgText fill={theme.colors.onSurfaceVariant} fontSize={14}>
            No data available
          </SvgText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={CHART_WIDTH} height={height}>
        <Path d={fillPathString} fill={color} opacity={0.1} />
        <Path d={animatedPathString} stroke={color} strokeWidth={3} fill="none" />
        {showDots &&
          animatedPoints.map((point, index) => (
            <G key={index}>
              <SvgText
                x={point.x}
                y={height - 5}
                fill={theme.colors.onSurfaceVariant}
                fontSize={10}
                textAnchor="middle"
              >
                {point.label}
              </SvgText>
              {progress > 0.5 && (
                <G>
                  <SvgText
                    x={point.x}
                    y={point.animatedY - 8}
                    fill={theme.colors.onSurface}
                    fontSize={10}
                    textAnchor="middle"
                  >
                    {point.value}
                  </SvgText>
                </G>
              )}
            </G>
          ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
