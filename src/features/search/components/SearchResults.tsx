import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { EmptyState } from './EmptyState';
import { NoResultsState } from './NoResultsState';
import { SearchResultItem } from './SearchResultItem';
import type { SearchResult } from '../types/search.types';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  isFetching: boolean;
  query: string;
  error: Error | null;
  onRefresh: () => void;
  onEndReached: () => void;
  onAgreementsPress?: () => void;
}

export function SearchResults({
  results,
  isLoading,
  isFetching,
  query,
  error,
  onRefresh,
  onEndReached,
  onAgreementsPress,
}: SearchResultsProps) {
  const theme = useTheme();

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.skeletonItem}>
          <View style={[styles.skeletonIcon, { backgroundColor: '#E5E7EB' }]} />
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonLine, { width: '70%', backgroundColor: '#E5E7EB' }]} />
            <View style={[styles.skeletonLine, { width: '50%', backgroundColor: '#F3F4F6', marginTop: 8 }]} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: SearchResult }) => (
      <SearchResultItem result={item} onAgreementsPress={onAgreementsPress} />
    ),
    [onAgreementsPress]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading || isFetching) return null;
    if (!query) return <EmptyState />;
    return <NoResultsState query={query} />;
  }, [isLoading, isFetching, query]);

  if (error && results.length === 0) {
    return null;
  }

  if (!query && !isLoading && results.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.resource_type}-${item.id}`}
      contentContainerStyle={results.length === 0 ? styles.emptyContent : styles.content}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={isFetching && !isLoading}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={['#4F46E5']}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        isLoading ? renderSkeleton() : null
      }
      testID="search-results-list"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  emptyContent: {
    flexGrow: 1,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
    borderRadius: 8,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 4,
  },
});
