import { visitorsApi } from "../services/visitorsApi";
import type {
  Visitor,
  VisitorCheckInPayload,
  VisitorCreatePayload,
  VisitorDetailResponse,
  VisitorFilterFormData,
  VisitorHistoryEntry,
  VisitorListResponse,
  VisitorQRGenerateResponse,
  VisitorStatsResponse,
  VisitorUpdatePayload,
} from "../types/visitors";

export const visitorsRepository = {
  fetchVisitors: async (params?: VisitorFilterFormData): Promise<VisitorListResponse> => {
    return visitorsApi.list(params);
  },

  fetchVisitor: async (id: number | string): Promise<VisitorDetailResponse> => {
    return visitorsApi.retrieve(id);
  },

  createVisitor: async (data: VisitorCreatePayload): Promise<Visitor> => {
    return visitorsApi.create(data);
  },

  updateVisitor: async (
    id: number | string,
    data: VisitorUpdatePayload
  ): Promise<Visitor> => {
    return visitorsApi.update(id, data);
  },

  deleteVisitor: async (id: number | string): Promise<void> => {
    return visitorsApi.remove(id);
  },

  approveVisitor: async (id: number | string, notes?: string): Promise<Visitor> => {
    return visitorsApi.approve(id, { notes });
  },

  rejectVisitor: async (id: number | string, reason?: string): Promise<Visitor> => {
    return visitorsApi.reject(id, { reason });
  },

  cancelVisitor: async (id: number | string): Promise<{ message: string }> => {
    return visitorsApi.cancel(id);
  },

  blockVisitor: async (id: number | string): Promise<{ message: string }> => {
    return visitorsApi.block(id);
  },

  checkInVisitor: async (
    id: number | string,
    payload?: VisitorCheckInPayload
  ): Promise<{ message: string }> => {
    return visitorsApi.checkIn(id, payload);
  },

  checkOutVisitor: async (
    id: number | string
  ): Promise<{ message: string; visit_duration_minutes?: number }> => {
    return visitorsApi.checkOut(id);
  },

  generateQR: async (id: number | string): Promise<VisitorQRGenerateResponse> => {
    return visitorsApi.generateQR(id);
  },

  verifyQR: async (id: number | string, qrToken: string): Promise<{ message: string }> => {
    return visitorsApi.verifyQR(id, qrToken);
  },

  generateOTP: async (id: number | string): Promise<{ message: string; otp_expires_at: string | null; otp_attempts_remaining: number }> => {
    return visitorsApi.generateOTP(id);
  },

  verifyOTP: async (
    id: number | string,
    otpCode: string
  ): Promise<{ message: string }> => {
    return visitorsApi.verifyOTP(id, otpCode);
  },

  fetchHistory: async (id: number | string): Promise<VisitorHistoryEntry[]> => {
    return visitorsApi.getHistory(id);
  },

  fetchStats: async (): Promise<VisitorStatsResponse> => {
    return visitorsApi.getStats();
  },

  fetchBuildings: async (): Promise<any[]> => {
    return visitorsApi.getBuildings();
  },

  fetchUnits: async (buildingId?: number): Promise<any[]> => {
    return visitorsApi.getUnits(buildingId);
  },

  fetchRenters: async (unitId?: number): Promise<any[]> => {
    return visitorsApi.getRenters(unitId);
  },

  fetchNotifications: async (): Promise<any[]> => {
    return visitorsApi.getNotifications();
  },

  verifyQRPublic: async (qrToken: string): Promise<any> => {
    return visitorsApi.verifyQRPublic(qrToken);
  },

  markExpired: async (): Promise<{ message: string }> => {
    return visitorsApi.markExpired();
  },
};
