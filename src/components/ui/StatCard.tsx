import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }, style]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color: theme.text }]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      {trend && (
        <Text style={[styles.trend, { color: trend.isPositive ? Colors.success : Colors.error }]}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 100,
  },
  icon: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  trend: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.xs,
  },
});
