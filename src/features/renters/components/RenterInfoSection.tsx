import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text as PaperText } from 'react-native-paper';
import type { RenterInfoSectionProps } from '../types';

export const RenterInfoSection: React.FC<RenterInfoSectionProps> = ({ title, data }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <PaperText style={[styles.title, { color: theme.text }]}>{title}</PaperText>
      {data.map((item, index) => (
        <List.Item
          key={index}
          title={item.value || 'N/A'}
          description={item.label}
          descriptionNumberOfLines={1}
          titleStyle={[styles.value, { color: theme.text }]}
          descriptionStyle={{ color: theme.subText }}
          style={[styles.item, { borderBottomColor: theme.border }]}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${item.label}: ${item.value || 'N/A'}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  item: {
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});
