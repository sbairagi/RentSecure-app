import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Circle, Path, Svg } from 'react-native-svg';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedPieChartProps {
  data: PieData[];
  size?: number;
  innerRadius?: number;
}

export const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  size = 200,
  innerRadius = 60,
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

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

  if (data.length === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={styles.emptyChart}>
          <Svg width={size} height={size}>
            <Circle cx={size / 2} cy={size / 2} r={innerRadius} fill={theme.colors.surface} />
          </Svg>
        </View>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = size / 2;
  const center = size / 2;
  const outerRadius = radius - 10;

  const getCoordinatesForPercent = (percent: number) => {
    const angle = percent * 2 * Math.PI - Math.PI / 2;
    const x = center + outerRadius * Math.cos(angle);
    const y = center + outerRadius * Math.sin(angle);
    return { x, y };
  };

  const segments = data.reduce<
    { startAngle: number; endAngle: number; color: string; label: string; value: number }[]
  >((acc, item) => {
    const prevEnd = acc.length > 0 ? acc[acc.length - 1].endAngle : 0;
    const angle = (item.value / total) * 2 * Math.PI;
    const startAngle = prevEnd;
    const endAngle = prevEnd + angle * progress;
    acc.push({
      startAngle,
      endAngle,
      color: item.color,
      label: item.label,
      value: item.value,
    });
    return acc;
  }, []);

  const renderPath = (segment: {
    startAngle: number;
    endAngle: number;
    color: string;
    label: string;
  }) => {
    const start = getCoordinatesForPercent(segment.startAngle / (2 * Math.PI) + 0.25);
    const end = getCoordinatesForPercent(segment.endAngle / (2 * Math.PI) + 0.25);
    const largeArcFlag = segment.endAngle - segment.startAngle > Math.PI ? 1 : 0;

    if (segment.endAngle - segment.startAngle < 0.01) return null;

    const pathData = [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');

    return (
      <Path
        key={segment.label}
        d={pathData}
        fill={segment.color}
        stroke={theme.colors.surface}
        strokeWidth={2}
      />
    );
  };

  const segmentsRender = segments.map((segment) => renderPath(segment));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {segmentsRender}
        <Circle cx={center} cy={center} r={innerRadius} fill={theme.colors.surface} />
      </Svg>
      <View style={styles.centerContent}>
        <View style={[styles.totalDot, { backgroundColor: theme.colors.primary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
