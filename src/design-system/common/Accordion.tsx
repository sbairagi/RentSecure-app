import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  allowMultiple?: boolean;
  style?: ViewStyle;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, style }) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const theme = useDesignSystemTheme();

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  return (
    <View style={style}>
      {items.map((item, index) => {
        const isOpen = openIndices.has(index);

        return (
          <View key={index} style={[styles.item, { borderBottomColor: theme.colors.neutral[200] }]}>
            <Pressable onPress={() => toggle(index)} style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.neutral[900] }]}>{item.title}</Text>
              <Text style={[styles.arrow, { color: theme.colors.neutral[500] }]}>
                {isOpen ? '▲' : '▼'}
              </Text>
            </Pressable>
            {isOpen && <View style={styles.content}>{item.content}</View>}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  content: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
  },
});
