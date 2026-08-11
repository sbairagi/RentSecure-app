// @ts-nocheck
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { useCaretakers, useCaretaker } from '../../hooks/useCaretakers';
import { useCaretakersStore } from '../../store/caretakersStore';
import {
  mockCaretaker,
  mockCaretakerListResponse,
} from '../mocks/data';

jest.mock('../../services/caretakersApi');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCaretakers', () => {
  beforeEach(() => {
    queryClient.clear();
    useCaretakersStore.setState({
      caretakers: [],
      selectedCaretaker: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  it('should return caretakers from store', async () => {
    useCaretakersStore.setState({ caretakers: mockCaretakerListResponse.results });
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(result.current.caretakers).toHaveLength(1);
  });

  it('should return loading state', async () => {
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should return error state', async () => {
    useCaretakersStore.setState({ error: 'Failed to load', isLoading: false });
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(result.current.error).toBe('Failed to load');
  });

  it('should provide refresh function', async () => {
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should provide createCaretaker function', async () => {
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(typeof result.current.createCaretaker).toBe('function');
  });

  it('should provide updateCaretaker function', async () => {
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(typeof result.current.updateCaretaker).toBe('function');
  });

  it('should provide deleteCaretaker function', async () => {
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(typeof result.current.deleteCaretaker).toBe('function');
  });

  it('should provide deactivateCaretaker function', async () => {
    const { result } = renderHook(() => useCaretakers(), { wrapper });
    expect(typeof result.current.deactivateCaretaker).toBe('function');
  });
});

describe('useCaretaker', () => {
  beforeEach(() => {
    queryClient.clear();
    useCaretakersStore.setState({
      caretakers: [],
      selectedCaretaker: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  it('should return selected caretaker from store', async () => {
    useCaretakersStore.setState({ selectedCaretaker: mockCaretaker });
    const { result } = renderHook(() => useCaretaker(1), { wrapper });
    expect(result.current.caretaker).toEqual(mockCaretaker);
  });

  it('should provide updateCaretaker function', async () => {
    const { result } = renderHook(() => useCaretaker(1), { wrapper });
    expect(typeof result.current.updateCaretaker).toBe('function');
  });

  it('should provide deleteCaretaker function', async () => {
    const { result } = renderHook(() => useCaretaker(1), { wrapper });
    expect(typeof result.current.deleteCaretaker).toBe('function');
  });

  it('should provide deactivateCaretaker function', async () => {
    const { result } = renderHook(() => useCaretaker(1), { wrapper });
    expect(typeof result.current.deactivateCaretaker).toBe('function');
  });

  it('should provide refresh function', async () => {
    const { result } = renderHook(() => useCaretaker(1), { wrapper });
    expect(typeof result.current.refresh).toBe('function');
  });
});
