import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useTheme, TextInput, Button, Portal, Modal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNetInfo } from '@react-native-community/netinfo';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { SearchSuggestions } from '../components/SearchSuggestions';
import { FilterPanel } from '../components/FilterPanel';
import { SearchHistory } from '../components/SearchHistory';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useSearch, useSearchSuggestions, useSearchHistory } from '../hooks';
import { useSearchStore } from '../store/searchStore';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import type { SearchOrdering } from '../types/search.types';

export default function GlobalSearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [query, setQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [errorType, setErrorType] = useState<'network' | 'timeout' | 'server_error' | 'generic'>('generic');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { filters, setResourceTypes, setOrdering, setPage } = useSearchStore();
  const { recentSearches, addSearch, removeSearch, clearAll } = useSearchHistory();

  const { data, isLoading, isFetching, error, refetch } = useSearch(query, filters);
  const { data: suggestions, isLoading: suggestionsLoading } = useSearchSuggestions(query);

  const showSuggestionsList = showSuggestions && query.trim().length >= 2 && !isLoading && suggestions.length > 0;

  useEffect(() => {
    if (error) {
      const message = (error as Error).message || 'Something went wrong';
      setErrorMessage(message);
      if (message.includes('Network') || message.includes('network') || !netInfo.isConnected) {
        setErrorType('network');
      } else if (message.includes('timeout') || message.includes('Timeout')) {
        setErrorType('timeout');
      } else if (message.includes('500')) {
        setErrorType('server_error');
      } else {
        setErrorType('generic');
      }
    }
  }, [error, netInfo.isConnected]);

  const handleSearchSubmit = useCallback(() => {
    if (query.trim().length >= 1) {
      setPage(1);
      setShowSuggestions(false);
      addSearch(query.trim());
    }
  }, [query, setPage, addSearch]);

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setPage(1);
      setShowSuggestions(false);
      addSearch(suggestion);
    },
    [addSearch, setPage]
  );

  const handleResourceTypesChange = useCallback(
    (types: string[]) => {
      setResourceTypes(types as any);
    },
    [setResourceTypes]
  );

  const handleOrderingChange = useCallback(
    (ordering: SearchOrdering) => {
      setOrdering(ordering);
    },
    [setOrdering]
  );

  const handleApplyFilters = useCallback(() => {
    setPage(1);
    setIsFilterExpanded(false);
  }, [setPage]);

  const handleClearFilters = useCallback(() => {
    setResourceTypes([]);
    setOrdering('relevance');
    setPage(1);
  }, [setResourceTypes, setOrdering, setPage]);

  const handleRefresh = useCallback(async () => {
    setErrorMessage('');
    await refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (!isFetching && data && filters.page < data.total_pages) {
      setPage(filters.page + 1);
    }
  }, [isFetching, data, filters.page, setPage]);

  const handleAgreementsPress = useCallback(() => {
    router.push('/(drawer)/(tabs)/agreements');
  }, [router]);

  const isOffline = !netInfo.isConnected;
  const hasError = error && data?.results.length === 0;
  const shouldShowOfflineBanner = isOffline && !isLoading;

  if (hasError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorState
          message={errorMessage}
          onRetry={handleRefresh}
          errorType={errorType}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {shouldShowOfflineBanner && (
        <View style={[styles.offlineBanner, { backgroundColor: '#FEF3C7' }]}>
          <Text style={styles.offlineText}>
            Offline — showing cached results
          </Text>
        </View>
      )}

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearchSubmit}
        isLoading={isLoading}
        suggestionsLoading={suggestionsLoading}
      />

      {showSuggestionsList && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          visible={showSuggestionsList}
        />
      )}

      <View style={styles.filterToggleRow}>
        <Button
          mode="text"
          onPress={() => setIsFilterExpanded(!isFilterExpanded)}
          contentStyle={styles.filterToggleButton}
          labelStyle={styles.filterToggleLabel}
          icon={isFilterExpanded ? 'chevron-up' : 'chevron-down'}
        >
          {isFilterExpanded ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </View>

      {isFilterExpanded && (
        <FilterPanel
          filters={{
            resource_type: filters.resource_type,
            ordering: filters.ordering,
          }}
          onResourceTypesChange={handleResourceTypesChange}
          onOrderingChange={handleOrderingChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          isExpanded={isFilterExpanded}
        />
      )}

      {query.trim().length === 0 ? (
        <SearchHistory
          recentSearches={recentSearches}
          onSearchSelect={(q) => {
            setQuery(q);
            handleSearchSubmit();
          }}
          onDelete={removeSearch}
          onClearAll={clearAll}
        />
      ) : (
        <SearchResults
          results={data?.results || []}
          isLoading={isLoading}
          isFetching={isFetching}
          query={query}
          error={error || null}
          onRefresh={handleRefresh}
          onEndReached={handleEndReached}
          onAgreementsPress={handleAgreementsPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
  },
  filterToggleRow: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  filterToggleButton: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  filterToggleLabel: {
    fontSize: 13,
  },
});
