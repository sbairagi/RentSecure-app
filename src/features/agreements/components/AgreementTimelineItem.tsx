import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AgreementTimelineItemProps } from '../types';

export const AgreementTimelineItem: React.FC<AgreementTimelineItemProps> = ({ item }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderLeftColor: theme.border }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{item.action}</Text>
        <Text style={[styles.description, { color: theme.subText }]}>
          {item.description}
        </Text>
        <Text style={[styles.timestamp, { color: theme.subText }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 2,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 13,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
  },
});
