// @ts-nocheck
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import { useSearchHistory } from '../useSearchHistory';
import { useSearchStore } from '../store/searchStore';

jest.mock('@/services/storage/mmkv');

const mockMMKV = {
  getString: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

(mmkvStorage as any).getItem = mockMMKV.getString;
(mmkvStorage as any).setItem = jest.fn();
(mmkvStorage as any).removeItem = jest.fn();

describe('useSearchHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchStore.setState({
      recentSearches: [],
    });
  });

  it('returns empty array when no history exists', async () => {
    mockMMKV.getString.mockReturnValue(null);
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    expect(result.current.recentSearches).toEqual([]);
  });

  it('loads existing history from storage', async () => {
    const stored = JSON.stringify([
      { query: 'building', timestamp: Date.now() - 1000 },
      { query: 'unit', timestamp: Date.now() },
    ]);
    mockMMKV.getString.mockReturnValue(stored);

    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    await require('@testing-library/react-native').waitFor(() =>
      expect(result.current.recentSearches.length).toBeGreaterThan(0)
    );

    expect(result.current.recentSearches.length).toBe(2);
  });

  it('adds a search to history', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    await result.current.addSearch('test query');

    const state = useSearchStore.getState();
    expect(state.recentSearches.length).toBe(1);
    expect(state.recentSearches[0].query).toBe('test query');
  });

  it('removes duplicate when adding existing query', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    await result.current.addSearch('test query');
    await result.current.addSearch('test query');

    const state = useSearchStore.getState();
    expect(state.recentSearches.length).toBe(1);
  });

  it('removes a search from history', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    await result.current.addSearch('query to remove');
    await result.current.removeSearch('query to remove');

    const state = useSearchStore.getState();
    expect(state.recentSearches.find((s) => s.query === 'query to remove')).toBeUndefined();
  });

  it('clears all searches', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    await result.current.addSearch('query 1');
    await result.current.addSearch('query 2');
    await result.current.clearAll();

    const state = useSearchStore.getState();
    expect(state.recentSearches.length).toBe(0);
  });

  it('does not store queries exceeding max length', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    const longQuery = 'a'.repeat(101);
    await result.current.addSearch(longQuery);

    const state = useSearchStore.getState();
    expect(state.recentSearches.length).toBe(0);
  });

  it('sanitizes queries by trimming and lowercasing', async () => {
    const { result } = require('@testing-library/react-native').renderHook(() =>
      useSearchHistory()
    );

    await result.current.addSearch('  Building Name  ');

    const state = useSearchStore.getState();
    expect(state.recentSearches[0].query).toBe('building name');
  });
});
