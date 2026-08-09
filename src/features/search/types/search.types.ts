export type SearchResourceType = 'buildings' | 'units' | 'renters' | 'caretakers' | 'rent_records' | 'visitors' | 'agreements';
export type SearchOrdering = 'newest' | 'oldest' | 'relevance';

export interface SearchResult {
  resource_type: SearchResourceType;
  id: number;
  title: string;
  subtitle: string;
  status: string;
  metadata: Record<string, any>;
  last_updated: string | null;
  navigation_target: string | null;
}

export interface SearchResponse {
  query: string;
  total_results: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: SearchResult[];
  available_resource_types: SearchResourceType[];
}

export interface SearchSuggestionsResponse {
  query: string;
  suggestions: string[];
}

export interface SearchFilters {
  resource_type: SearchResourceType[];
  ordering: SearchOrdering;
  page: number;
  page_size: number;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
