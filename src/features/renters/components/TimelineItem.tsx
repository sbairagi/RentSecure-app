import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import type { TimelineItemProps } from '../types';

const TIMELINE_ICONS: Record<string, string> = {
  created: 'plus-circle',
  updated: 'pencil',
  assigned: 'account-plus',
  vacated: 'account-remove',
  agreement: 'file-document',
  payment: 'cash',
  verification: 'shield-check',
  document: 'file-upload',
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ item }) => {
  const theme = useTheme();
  const title = item.title || 'Activity';

  return (
    <List.Item
      title={title}
      description={item.description}
      descriptionNumberOfLines={3}
      titleStyle={[styles.title, { color: theme.text }]}
      descriptionStyle={{ color: theme.subText }}
      style={[styles.item, { borderBottomColor: theme.border }]}
      left={(props) => (
        <View style={styles.iconContainer}>
          <List.Icon
            {...props}
            icon={item.icon || TIMELINE_ICONS[title.toLowerCase()] || 'circle'}
            color={theme.primary}
          />
        </View>
      )}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${title}: ${item.description}`}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
});
