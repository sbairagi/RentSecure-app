import { useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { renterDashboardApi } from '../api/renterDashboardApi';
import type { RenterDashboard, RenterRentRecord, RenterRentRecordsResponse } from '../types/renterDashboard';

const DASHBOARD_QUERY_KEY = ['renter', 'dashboard'];
const PROFILE_QUERY_KEY = ['renter', 'profile'];
const RENT_RECORDS_QUERY_KEY = (params?: { page?: number; limit?: number }) => ['renter', 'rent-records', params];
const RENT_RECORD_DETAIL_QUERY_KEY = (id: number | string) => ['renter', 'rent-record', id];
const AGREEMENT_QUERY_KEY = ['renter', 'agreement'];
const DOCUMENTS_QUERY_KEY = ['renter', 'documents'];
const EXTRA_CHARGES_QUERY_KEY = (params?: { page?: number; limit?: number }) => ['renter', 'extra-charges', params];

export const useRenterDashboard = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterDashboard>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: renterDashboardApi.getDashboard,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: ['renter', 'rent-records'] });
    await queryClient.invalidateQueries({ queryKey: AGREEMENT_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: ['renter', 'extra-charges'] });
  };

  return {
    dashboard: data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
  };
};

export const useRenterProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: renterDashboardApi.getProfile,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useRenterRentRecords = (params?: { page?: number; limit?: number }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterRentRecordsResponse>({
    queryKey: RENT_RECORDS_QUERY_KEY(params),
    queryFn: () => renterDashboardApi.getRentRecords(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: RENT_RECORDS_QUERY_KEY(params) });
  };

  return {
    data,
    payments: data?.data || [],
    pagination: data?.meta,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
    total: data?.meta?.total || 0,
  };
};

export const useRenterRentRecordDetail = (id: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterRentRecord>({
    queryKey: RENT_RECORD_DETAIL_QUERY_KEY(id),
    queryFn: () => renterDashboardApi.getRentRecordDetail(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: RENT_RECORD_DETAIL_QUERY_KEY(id) });
  };

  return {
    payment: data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
  };
};

export const useRenterAgreement = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: AGREEMENT_QUERY_KEY,
    queryFn: renterDashboardApi.getAgreement,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: AGREEMENT_QUERY_KEY });
  };

  return {
    agreement: data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
  };
};

export const useRenterDocuments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: DOCUMENTS_QUERY_KEY,
    queryFn: renterDashboardApi.getDocuments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
  };

  return {
    documents: data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
  };
};

export const useRenterExtraCharges = (params?: { page?: number; limit?: number }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterExtraChargesResponse>({
    queryKey: EXTRA_CHARGES_QUERY_KEY(params),
    queryFn: () => renterDashboardApi.getExtraCharges(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: EXTRA_CHARGES_QUERY_KEY(params) });
  };

  return {
    data,
    charges: data?.data || [],
    pagination: data?.meta,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
    total: data?.meta?.total || 0,
  };
};