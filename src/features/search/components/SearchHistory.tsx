import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';

interface SearchHistoryProps {
  recentSearches: { query: string; timestamp: number }[];
  onSearchSelect: (query: string) => void;
  onDelete: (query: string) => void;
  onClearAll: () => void;
}

export function SearchHistory({
  recentSearches,
  onSearchSelect,
  onDelete,
  onClearAll,
}: SearchHistoryProps) {
  const theme = useTheme();

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const renderItem = useCallback(
    ({ item }: { item: { query: string; timestamp: number } }) => (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => onSearchSelect(item.query)}
          accessibilityLabel={`Recent search: ${item.query}`}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <Text style={styles.historyIcon}>🕐</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.queryText, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.query}
            </Text>
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.query)}
          accessibilityLabel={`Remove ${item.query} from history`}
          accessibilityRole="button"
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    ),
    [onSearchSelect, onDelete, theme.colors.onSurface]
  );

  if (recentSearches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Recent Searches</Text>
        <TouchableOpacity onPress={onClearAll} accessibilityLabel="Clear all searches">
          <Text style={[styles.clearAllText, { color: theme.colors.primary }]}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recentSearches}
        renderItem={renderItem}
        keyExtractor={(item) => `history-${item.query}-${item.timestamp}`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        testID="search-history-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  historyIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#9CA3AF',
  },
  textContainer: {
    flex: 1,
  },
  queryText: {
    fontSize: 15,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
