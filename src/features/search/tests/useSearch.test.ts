// @ts-nocheck
import { useSearch, useSearchSuggestions } from '../useSearch';
import { searchRepository } from '../repository/searchRepository';

jest.mock('@/providers/queryClient');
jest.mock('../repository/searchRepository');

const mockQueryClient = queryClient as jest.Mocked<typeof queryClient>;
const mockSearchRepository = searchRepository as jest.Mocked<typeof searchRepository>;

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryClient.cancelQueries = jest.fn();
  });

  const defaultFilters = {
    resource_type: [],
    ordering: 'relevance' as const,
    page: 1,
    page_size: 20,
  };

  it('returns loading state initially for short query', () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearch('ab', defaultFilters)
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('fetches search results', async () => {
    const mockResponse = {
      query: 'building',
      total_results: 5,
      page: 1,
      page_size: 20,
      total_pages: 1,
      results: [
        {
          resource_type: 'buildings' as const,
          id: 1,
          title: 'Test Building',
          subtitle: 'Test',
          status: 'active',
          metadata: {},
          last_updated: new Date().toISOString(),
          navigation_target: 'buildings-detail',
        },
      ],
      available_resource_types: ['buildings'],
    };

    mockSearchRepository.search.mockResolvedValue(mockResponse as any);

    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearch('building', defaultFilters)
    );

    await require('@testing-library/react-native').waitFor(() =>
      expect(result.current.data?.total_results).toBe(5)
    );

    expect(mockSearchRepository.search).toHaveBeenCalledWith(
      'building',
      expect.any(Object)
    );
  });

  it('cancels pending queries when query changes', async () => {
    const { result, rerender } = require('@testing-library/react-native').renderHook(
      ({ query, filters }) => useSearch(query, filters),
      { initialProps: { query: 'building', filters: defaultFilters } }
    );

    rerender({ query: 'unit', filters: defaultFilters });

    expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
  });

  it('does not search when query is empty', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearch('', defaultFilters)
    );

    await require('@testing-library/react-native').waitFor(() =>
      expect(mockSearchRepository.search).not.toHaveBeenCalled()
    );
  });

  it('returns error on API failure', async () => {
    mockSearchRepository.search.mockRejectedValue(new Error('Network Error'));

    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearch('building', defaultFilters)
    );

    await require('@testing-library/react-native').waitFor(() =>
      expect(result.current.error).not.toBeNull()
    );
  });
});

describe('useSearchSuggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryClient.cancelQueries = jest.fn();
  });

  it('returns empty suggestions for short query', () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchSuggestions('ab')
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches suggestions for valid query', async () => {
    mockSearchRepository.getSuggestions.mockResolvedValue({
      query: 'bui',
      suggestions: ['building', 'building name', 'building complex'],
    });

    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchSuggestions('bui')
    );

    await require('@testing-library/react-native').waitFor(() =>
      expect(result.current.data.length).toBeGreaterThan(0)
    );

    expect(result.current.data).toEqual(['building', 'building name', 'building complex']);
  });

  it('does not fetch suggestions for single character', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchSuggestions('b')
    );

    expect(result.current.data).toEqual([]);
    expect(mockSearchRepository.getSuggestions).not.toHaveBeenCalled();
  });
});
