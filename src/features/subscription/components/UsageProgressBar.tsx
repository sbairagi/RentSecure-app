import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ProgressBar } from 'react-native-paper';
import type { EffectiveLimit } from '../types';
import { getUsageColor, formatPercentage } from '../utils/formatting';

interface UsageProgressBarProps {
  limit: EffectiveLimit;
  showLabel?: boolean;
  height?: number;
}

export function UsageProgressBar({ limit, showLabel = true, height = 8 }: UsageProgressBarProps) {
  const theme = useTheme();
  const color = getUsageColor(limit.percentageUsed);
  const progress = limit.effectiveLimit === 'unlimited' ? 0 : limit.currentUsage / limit.effectiveLimit;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            {limit.currentUsage} / {limit.effectiveLimit === 'unlimited' ? '∞' : limit.effectiveLimit}
          </Text>
          <Text style={[styles.percentage, { color }]}>
            {limit.effectiveLimit === 'unlimited' ? '0%' : formatPercentage(limit.percentageUsed)}
          </Text>
        </View>
      )}
      <ProgressBar
        progress={Math.min(progress, 1)}
        color={color}
        style={[styles.progress, { height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  progress: {
    borderRadius: 4,
  },
});
