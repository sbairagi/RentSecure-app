import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import type { NoteCardProps } from '../types';

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.card }]}>
      <Card.Content>
        <Text style={[styles.content, { color: theme.text }]}>{note.content}</Text>
        <View style={styles.meta}>
          <Text style={[styles.author, { color: theme.subText }]}>By {note.author}</Text>
          <Text style={[styles.date, { color: theme.subText }]}>
            {new Date(note.created_at).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
      {note.updated_at !== note.created_at && <Divider style={{ backgroundColor: theme.border }} />}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
  },
});
