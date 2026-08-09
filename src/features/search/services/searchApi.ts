import { apiService } from '@/services/api/apiClient';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import type { SearchResponse, SearchSuggestionsResponse } from '../types/search.types';

export const searchApi = {
  search: async (
    query: string,
    filters?: {
      resource_type?: string;
      page?: number;
      page_size?: number;
      ordering?: string;
      include_archived?: boolean;
    }
  ): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (filters?.resource_type) searchParams.set('resource_type', filters.resource_type);
    if (filters?.page) searchParams.set('page', String(filters.page));
    if (filters?.page_size) searchParams.set('page_size', String(filters.page_size));
    if (filters?.ordering) searchParams.set('ordering', filters.ordering);
    if (filters?.include_archived !== undefined) searchParams.set('include_archived', String(filters.include_archived));
    const queryString = searchParams.toString();
    return apiService.get<SearchResponse>(
      `${SEARCH_CONSTANTS.API.GLOBAL_SEARCH}${queryString ? `?${queryString}` : ''}`
    );
  },

  getSuggestions: async (query: string, limit = 10): Promise<SearchSuggestionsResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    searchParams.set('limit', String(limit));
    return apiService.get<SearchSuggestionsResponse>(
      `${SEARCH_CONSTANTS.API.SUGGESTIONS}?${searchParams.toString()}`
    );
  },
};
