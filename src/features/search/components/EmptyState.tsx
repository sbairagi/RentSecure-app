import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSearchHistory } from '../hooks/useSearchHistory';

interface EmptyStateProps {
  showHistory?: boolean;
}

export function EmptyState({ showHistory = true }: EmptyStateProps) {
  const theme = useTheme();
  const { recentSearches, addSearch } = useSearchHistory();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Start typing to search</Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        Search across buildings, units, renters, and more
      </Text>
      {showHistory && recentSearches.length > 0 && (
        <Text style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
          Or select from your recent searches below
        </Text>
      )}
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
    lineHeight: 20,
  },
  hint: {
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
  },
});
