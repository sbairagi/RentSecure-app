import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { showMessage } from "react-native-flash-message";
import { visitorsRepository } from "../repository/visitorsRepository";
import { useVisitorsStore } from "../store/visitorsStore";
import type { Visitor, VisitorCheckInPayload, VisitorCreatePayload, VisitorFilterFormData, VisitorUpdatePayload } from "../types/visitors";
import { VISITOR_CONSTANTS } from "../constants/visitorConstants";

const VISITORS_QUERY_KEY = ["visitors"];
const VISITOR_DETAIL_KEY = (id: number | string) => ["visitor", id];
const VISITOR_STATS_KEY = ["visitor_stats"];
const VISITOR_HISTORY_KEY = (id: number | string) => ["visitor_history", id];

export const useVisitors = (params?: VisitorFilterFormData) => {
  const queryClient = useQueryClient();
  const { setError } = useVisitorsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [...VISITORS_QUERY_KEY, params],
    queryFn: async () => {
      const result = await visitorsRepository.fetchVisitors(params);
      const list: Visitor[] = Array.isArray(result) ? result : result.results || [];
      useVisitorsStore.getState().cacheVisitors(list);
      return list;
    },
    staleTime: VISITOR_CONSTANTS.CACHE.STALE_TIME,
    gcTime: VISITOR_CONSTANTS.CACHE.GC_TIME,
    retry: 2,
    refetchOnReconnect: true,
    initialData: () => {
      const cached = useVisitorsStore.getState().visitors;
      return cached.length > 0 ? cached : undefined;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: VisitorCreatePayload) =>
      visitorsRepository.createVisitor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor request created successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to create visitor request";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: VisitorUpdatePayload }) =>
      visitorsRepository.updateVisitor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      showMessage({ message: "Visitor updated successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to update visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => visitorsRepository.deleteVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor request deleted", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to delete visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number | string; notes?: string }) =>
      visitorsRepository.approveVisitor(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor approved successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to approve visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      visitorsRepository.rejectVisitor(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor rejected", type: "info" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to reject visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number | string) => visitorsRepository.cancelVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor request cancelled", type: "info" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to cancel visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const blockMutation = useMutation({
    mutationFn: (id: number | string) => visitorsRepository.blockVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor blocked", type: "info" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to block visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload?: VisitorCheckInPayload }) =>
      visitorsRepository.checkInVisitor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor checked in successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to check in visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (id: number | string) => visitorsRepository.checkOutVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor checked out successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to check out visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const generateQRMutation = useMutation({
    mutationFn: (id: number | string) => visitorsRepository.generateQR(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      showMessage({ message: "QR code generated successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to generate QR code";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const generateOTPMutation = useMutation({
    mutationFn: (id: number | string) => visitorsRepository.generateOTP(id),
    onSuccess: () => {
      showMessage({ message: "OTP sent successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to generate OTP";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: ({ id, otpCode }: { id: number | string; otpCode: string }) =>
      visitorsRepository.verifyOTP(id, otpCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      showMessage({ message: "OTP verified successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Invalid OTP";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || "Failed to refresh visitors";
      setError(message);
    }
  }, [refetch, setError]);

  return {
    visitors: data || [],
    isLoading,
    isFetching,
    error: error?.message || null,
    refresh,
    createVisitor: createMutation.mutate,
    updateVisitor: updateMutation.mutate,
    deleteVisitor: deleteMutation.mutate,
    approveVisitor: approveMutation.mutate,
    rejectVisitor: rejectMutation.mutate,
    cancelVisitor: cancelMutation.mutate,
    blockVisitor: blockMutation.mutate,
    checkInVisitor: checkInMutation.mutate,
    checkOutVisitor: checkOutMutation.mutate,
    generateQR: generateQRMutation.mutate,
    generateOTP: generateOTPMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
  };
};

export const useVisitor = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setError } = useVisitorsStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: VISITOR_DETAIL_KEY(id),
    queryFn: async () => {
      const result = await visitorsRepository.fetchVisitor(id);
      useVisitorsStore.getState().cacheSelectedVisitor(result);
      return result;
    },
    staleTime: VISITOR_CONSTANTS.CACHE.STALE_TIME,
    gcTime: VISITOR_CONSTANTS.CACHE.GC_TIME,
    retry: 2,
    refetchOnReconnect: true,
    initialData: async () => {
      const cached = await useVisitorsStore.getState().getCachedSelectedVisitor(id);
      return cached || undefined;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id: visitorId, payload }: { id: number | string; payload: VisitorUpdatePayload }) =>
      visitorsRepository.updateVisitor(visitorId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(variables.id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to update visitor";
      setError(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (visitorId: number | string) => visitorsRepository.deleteVisitor(visitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to delete visitor";
      setError(message);
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || "Failed to refresh visitor";
      setError(message);
    }
  }, [refetch, setError]);

  return {
    visitor: data || null,
    isLoading,
    error: error?.message || null,
    refresh,
    updateVisitor: updateMutation.mutate,
    deleteVisitor: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useVisitorStats = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: VISITOR_STATS_KEY,
    queryFn: async () => {
      const result = await visitorsRepository.fetchStats();
      useVisitorsStore.getState().setStats(result);
      return result;
    },
    staleTime: VISITOR_CONSTANTS.CACHE.STALE_TIME,
    gcTime: VISITOR_CONSTANTS.CACHE.GC_TIME,
    retry: 2,
    refetchOnReconnect: true,
  });

  return {
    stats: data || null,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

export const useVisitorHistory = (id: number | string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: VISITOR_HISTORY_KEY(id),
    queryFn: async () => visitorsRepository.fetchHistory(id),
    staleTime: VISITOR_CONSTANTS.CACHE.STALE_TIME,
    gcTime: VISITOR_CONSTANTS.CACHE.GC_TIME,
    retry: 2,
    enabled: !!id,
  });

  return {
    history: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

export const useVisitorActions = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setError } = useVisitorsStore();

  const approveMutation = useMutation({
    mutationFn: (notes?: string) => visitorsRepository.approveVisitor(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_HISTORY_KEY(id) });
      showMessage({ message: "Visitor approved successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to approve visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason?: string) => visitorsRepository.rejectVisitor(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_HISTORY_KEY(id) });
      showMessage({ message: "Visitor rejected", type: "info" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to reject visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => visitorsRepository.cancelVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor request cancelled", type: "info" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to cancel visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const blockMutation = useMutation({
    mutationFn: () => visitorsRepository.blockVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      showMessage({ message: "Visitor blocked", type: "info" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to block visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: (payload?: VisitorCheckInPayload) =>
      visitorsRepository.checkInVisitor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_HISTORY_KEY(id) });
      showMessage({ message: "Visitor checked in successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to check in visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => visitorsRepository.checkOutVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_HISTORY_KEY(id) });
      showMessage({ message: "Visitor checked out successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to check out visitor";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const generateQRMutation = useMutation({
    mutationFn: () => visitorsRepository.generateQR(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      showMessage({ message: "QR code generated successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to generate QR code";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const generateOTPMutation = useMutation({
    mutationFn: () => visitorsRepository.generateOTP(id),
    onSuccess: () => {
      showMessage({ message: "OTP generated successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to generate OTP";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: (otpCode: string) => visitorsRepository.verifyOTP(id, otpCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITOR_DETAIL_KEY(id) });
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VISITOR_HISTORY_KEY(id) });
      showMessage({ message: "OTP verified successfully", type: "success" });
    },
    onError: (err: any) => {
      const message = err?.message || "Invalid OTP";
      setError(message);
      showMessage({ message, type: "danger" });
    },
  });

  return {
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    cancel: cancelMutation.mutate,
    block: blockMutation.mutate,
    checkIn: checkInMutation.mutate,
    checkOut: checkOutMutation.mutate,
    generateQR: generateQRMutation.mutate,
    generateOTP: generateOTPMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isBlocking: blockMutation.isPending,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    isGeneratingQR: generateQRMutation.isPending,
    isGeneratingOTP: generateOTPMutation.isPending,
    isVerifyingOTP: verifyOTPMutation.isPending,
  };
};
