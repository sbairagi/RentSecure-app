import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Message } from '../types';
import { formatTimestamp } from '../utils';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser
          ? [styles.userContainer, { justifyContent: 'flex-end' }]
          : [styles.assistantContainer, { justifyContent: 'flex-start' }],
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <MaterialCommunityIcons name="robot" size={20} color="#fff" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser
              ? theme.colors.primary
              : theme.colors.surface,
          },
        ]}
      >
        {message.is_error && (
          <View style={styles.errorHeader}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={16}
              color={theme.colors.error}
            />
            <Text style={[styles.errorLabel, { color: theme.colors.error }]}>
              Error
            </Text>
          </View>
        )}
        <Text
          style={[
            styles.content,
            {
              color: isUser
                ? '#fff'
                : theme.colors.onSurface,
            },
          ]}
        >
          {message.content}
        </Text>
        {message.tools_used && message.tools_used.length > 0 && (
          <View style={styles.toolsContainer}>
            <Text
              style={[
                styles.toolsLabel,
                {
                  color: isUser
                    ? 'rgba(255,255,255,0.7)'
                    : theme.colors.onSurfaceVariant,
                },
              ]}
            >
              Tools: {message.tools_used.join(', ')}
            </Text>
          </View>
        )}
        {message.data && Object.keys(message.data).length > 0 && (
          <View style={styles.dataContainer}>
            <ScrollView nestedScrollEnabled horizontal>
              <Text
                style={[
                  styles.dataText,
                  {
                    color: isUser
                      ? 'rgba(255,255,255,0.8)'
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {JSON.stringify(message.data, null, 2)}
              </Text>
            </ScrollView>
          </View>
        )}
        <Text
          style={[
            styles.timestamp,
            {
              color: isUser
                ? 'rgba(255,255,255,0.6)'
                : theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {formatTimestamp(message.timestamp)}
        </Text>
        {message.is_error && onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Text style={[styles.retryText, { color: theme.colors.primary }]}>
              Retry
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
  },
  toolsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  toolsLabel: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  dataContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  retryButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
