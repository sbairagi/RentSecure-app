import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { documentsRepository } from '../repository/documentsRepository';
import { useDocumentsStore } from '../store/documentsStore';
import type { DocumentFilters, DocumentListResponse } from '../types';

const DOCUMENTS_QUERY_KEY = (params?: DocumentFilters) => ['documents', 'list', params];

export const useDocuments = (params?: DocumentFilters) => {
  const queryClient = useQueryClient();
  const { setDocuments, setError, cacheDocuments } = useDocumentsStore();

  const { data, isLoading, isFetching, error } = useQuery<DocumentListResponse>({
    queryKey: DOCUMENTS_QUERY_KEY(params),
    queryFn: () => documentsRepository.fetchDocuments(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      cacheDocuments(data);
      const list = Array.isArray(data) ? data : data.results || [];
      setDocuments(list);
    }
  }, [data, setDocuments, cacheDocuments]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load documents');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY(params) });
  }, [params, queryClient]);

  const documents = useDocumentsStore((state) => state.documents);

  return {
    documents,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: Array.isArray(data) ? data.length : data?.count || 0,
  };
};
