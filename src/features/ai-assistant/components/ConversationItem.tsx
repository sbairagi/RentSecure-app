import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ConversationSummary } from '../types';

interface ConversationItemProps {
  conversation: ConversationSummary;
  onPress: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  onPress,
  onDelete,
}: ConversationItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="message-text-outline"
          size={24}
          color={theme.colors.primary}
        />
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {conversation.title}
          </Text>
          <Text
            style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}
          >
            {conversation.message_count} messages
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons
          name="delete-outline"
          size={20}
          color={theme.colors.error}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});
