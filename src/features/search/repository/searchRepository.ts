import { searchApi } from '../services/searchApi';
import type { SearchResponse, SearchSuggestionsResponse } from '../types/search.types';

export const searchRepository = {
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
    return searchApi.search(query, filters);
  },

  getSuggestions: async (query: string, limit = 10): Promise<SearchSuggestionsResponse> => {
    return searchApi.getSuggestions(query, limit);
  },
};
