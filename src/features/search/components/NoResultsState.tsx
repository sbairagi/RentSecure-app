import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface NoResultsStateProps {
  query: string;
}

export function NoResultsState({ query }: NoResultsStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.icon}>📭</Text>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        No results found
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        No results found for &quot;{query}&quot;
      </Text>
      <Text style={[styles.suggestion, { color: theme.colors.onSurfaceVariant }]}>
        Try checking your spelling or adjusting your filters
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 13,
    textAlign: 'center',
    color: '#9CA3AF',
  },
});
