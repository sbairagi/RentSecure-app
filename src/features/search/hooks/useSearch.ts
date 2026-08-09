import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchRepository } from '../repository/searchRepository';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import { useSearchStore } from '../store/searchStore';
import { useDebounce } from './useDebounce';
import type { SearchFilters, SearchResponse } from '../types/search.types';

export interface UseSearchResult {
  data: SearchResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<SearchResponse | undefined>;
  suggestions: string[];
  suggestionsLoading: boolean;
}

export function useSearch(query: string, filters: SearchFilters): UseSearchResult {
  const queryClient = useQueryClient();
  const debouncedQuery = useDebounce(query, SEARCH_CONSTANTS.DEBOUNCE.SEARCH_MS);
  const debouncedResourceType = useDebounce(filters.resource_type.join(','), SEARCH_CONSTANTS.DEBOUNCE.SEARCH_MS);
  const setQuery = useSearchStore((s: { setQuery: (q: string) => void }) => s.setQuery);

  useEffect(() => {
    setQuery(query);
  }, [query, setQuery]);

  const queryKey = useMemo(() => {
    return [
      'search',
      'global',
      debouncedQuery,
      {
        resource_type: debouncedResourceType,
        ordering: filters.ordering,
        page: filters.page,
        page_size: filters.page_size,
      },
    ];
  }, [debouncedQuery, debouncedResourceType, filters.ordering, filters.page, filters.page_size]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<SearchResponse> => {
      const trimmedQuery = debouncedQuery.trim();
      if (trimmedQuery.length < 1) {
        return {
          query: trimmedQuery,
          total_results: 0,
          page: 1,
          page_size: filters.page_size,
          total_pages: 0,
          results: [],
          available_resource_types: [],
        } as SearchResponse;
      }

      const resourceType = debouncedResourceType || undefined;
      return searchRepository.search(trimmedQuery, {
        resource_type: resourceType,
        ordering: filters.ordering,
        page: filters.page,
        page_size: filters.page_size,
      });
    },
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error: Error) => {
      if (error.message === 'Network Error' || error.message === 'No internet connection') {
        return failureCount < 1;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query.trim().length >= 2) {
      queryClient.cancelQueries({ queryKey: ['search', 'suggestions', query] });
    }
  }, [query, queryClient]);

  const mappedError = useMemo(() => {
    if (!error) return null;
    return new Error((error as Error).message || 'Search failed');
  }, [error]);

  return {
    data,
    isLoading,
    isFetching,
    error: mappedError,
    refetch: useCallback(async () => {
      return queryClient.fetchQuery({ queryKey, queryFn: async () => searchRepository.search(debouncedQuery.trim(), {
        resource_type: filters.resource_type.join(',') || undefined,
        ordering: filters.ordering,
        page: filters.page,
        page_size: filters.page_size,
      }) });
    }, [queryClient, queryKey, debouncedQuery, filters]),
    suggestions: [],
    suggestionsLoading: false,
  };
}

export interface UseSearchSuggestionsResult {
  data: string[];
  isLoading: boolean;
}

export function useSearchSuggestions(query: string): UseSearchSuggestionsResult {
  const debouncedQuery = useDebounce(query, SEARCH_CONSTANTS.DEBOUNCE.SUGGESTIONS_MS);
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['search', 'suggestions', debouncedQuery], [debouncedQuery]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<string[]> => {
      if (debouncedQuery.trim().length < 2) return [];
      const response = await searchRepository.getSuggestions(debouncedQuery.trim());
      return response.suggestions;
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.trim().length < 2) {
      queryClient.cancelQueries({ queryKey });
    }
  }, [query, queryClient, queryKey]);

  return {
    data: data || [],
    isLoading,
  };
}
