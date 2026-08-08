import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Text,
  Chip,
  useTheme,
} from 'react-native-paper';
import type { EffectiveLimit } from '../types';
import { FEATURE_LABELS } from '../types/limits';
import { formatUsage, getUsageColor } from '../utils/formatting';

interface FeatureLimitRowProps {
  limit: EffectiveLimit;
  onPress?: () => void;
}

export function FeatureLimitRow({ limit, onPress }: FeatureLimitRowProps) {
  const theme = useTheme();
  const label = (FEATURE_LABELS as Record<string, string>)[limit.featureKey] || limit.featureKey;
  const usageText = formatUsage(limit.currentUsage, limit.effectiveLimit);
  const color = getUsageColor(limit.percentageUsed);

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.outlineVariant }]}>
      <View style={styles.info}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>
          {label.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
        </Text>
        <Text style={[styles.usage, { color: theme.colors.onSurfaceVariant }]}>
          {usageText}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Chip 
          mode="flat" 
          compact 
          style={{ backgroundColor: limit.canUse ? theme.colors.primaryContainer : theme.colors.errorContainer }}
          textStyle={{ color: limit.canUse ? theme.colors.primary : theme.colors.error, fontSize: 12 }}
        >
          {limit.canUse ? 'Available' : 'Limit Reached'}
        </Chip>
        {onPress && (
          <Text style={[styles.upgradeLink, { color: theme.colors.primary }]} onPress={onPress}>
            Upgrade
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  usage: {
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  upgradeLink: {
    fontSize: 12,
    fontWeight: '600',
  },
});
