import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { documentsRepository } from '../repository/documentsRepository';
import { useDocumentsStore } from '../store/documentsStore';
import type { DocumentFilters, DocumentListResponse } from '../types';

const DOCUMENTS_QUERY_KEY = (params?: DocumentFilters) => ['documents', 'list', params];
const IMAGES_QUERY_KEY = (params?: DocumentFilters) => ['images', 'list', params];

export const useDocuments = (params?: DocumentFilters) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery<DocumentListResponse>({
    queryKey: DOCUMENTS_QUERY_KEY(params),
    queryFn: () => documentsRepository.listDocuments(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

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
    total: data?.count ?? documents.length,
  };
};

export const useImages = (params?: DocumentFilters) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery<DocumentListResponse>({
    queryKey: IMAGES_QUERY_KEY(params),
    queryFn: () => documentsRepository.listImages(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY(params) });
  }, [params, queryClient]);

  const images = useDocumentsStore((state) => state.images);

  return {
    images,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: data?.count ?? images.length,
  };
};
