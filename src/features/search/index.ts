import { useSearch } from './hooks/useSearch';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useDebounce } from './hooks/useDebounce';
import GlobalSearchScreen from './screens/GlobalSearchScreen';
import { searchRepository } from './repository/searchRepository';
import { searchApi } from './services/searchApi';
import { useSearchStore } from './store/searchStore';
import { formatRelativeTime, buildNavigationTarget, isDeepLinkAvailable, getResourceTypeColor, getResourceTypeIcon, getResourceTypeBadgeStyle } from './utils/search.utils';
import { SEARCH_CONSTANTS } from './constants/searchConstants';
import type { SearchResourceType, SearchOrdering, SearchResult, SearchResponse, SearchSuggestionsResponse, SearchFilters, SearchState } from './types/search.types';

export {
  useSearch,
  useSearchHistory,
  useDebounce,
  GlobalSearchScreen,
  searchRepository,
  searchApi,
  useSearchStore,
  formatRelativeTime,
  buildNavigationTarget,
  isDeepLinkAvailable,
  getResourceTypeColor,
  getResourceTypeIcon,
  getResourceTypeBadgeStyle,
  SEARCH_CONSTANTS,
};
export type {
  SearchResourceType,
  SearchOrdering,
  SearchResult,
  SearchResponse,
  SearchSuggestionsResponse,
  SearchFilters,
  SearchState,
};
