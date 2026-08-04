import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';
import { Card } from './Card';

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.neutral[500] }]}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      <Text style={[styles.value, { color: theme.colors.neutral[900] }]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      {(change !== undefined || changeLabel) && (
        <View style={styles.footer}>
          {change !== undefined && (
            <Text
              style={[
                styles.change,
                {
                  color: isPositive
                    ? theme.colors.success[500]
                    : isNegative
                      ? theme.colors.error[500]
                      : theme.colors.neutral[500],
                },
              ]}
            >
              {isPositive ? '↑' : isNegative ? '↓' : ''} {Math.abs(change)}%
            </Text>
          )}
          {changeLabel && (
            <Text style={[styles.changeLabel, { color: theme.colors.neutral[400] }]}>
              {changeLabel}
            </Text>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  change: {
    fontSize: 13,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 12,
  },
});
