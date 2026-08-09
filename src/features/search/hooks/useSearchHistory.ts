import { useCallback, useEffect, useState } from 'react';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import { useSearchStore } from '../store/searchStore';

interface SearchHistoryResult {
  recentSearches: { query: string; timestamp: number }[];
  addSearch: (query: string) => Promise<void>;
  removeSearch: (query: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useSearchHistory(): SearchHistoryResult {
  const [loaded, setLoaded] = useState(false);
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useSearchStore();

  useEffect(() => {
    if (!loaded) {
      useSearchStore.getState().loadRecentSearches();
      setLoaded(true);
    }
  }, [loaded]);

  const addSearch = useCallback(
    async (query: string) => {
      await addRecentSearch(query);
    },
    [addRecentSearch]
  );

  const removeSearch = useCallback(
    async (query: string) => {
      await removeRecentSearch(query);
    },
    [removeRecentSearch]
  );

  const clearAll = useCallback(async () => {
    await clearRecentSearches();
  }, [clearRecentSearches]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
  };
}
