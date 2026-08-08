import { apiService } from "@/services/api/apiClient";
import { VISITOR_CONSTANTS } from "../constants/visitorConstants";
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

export const visitorsApi = {
  list: async (params?: VisitorFilterFormData): Promise<VisitorListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.building) searchParams.set("building", String(params.building));
    if (params?.unit) searchParams.set("unit", String(params.unit));
    if (params?.renter) searchParams.set("renter", String(params.renter));
    if (params?.visit_date) searchParams.set("visit_date", params.visit_date);
    if (params?.ordering) searchParams.set("ordering", params.ordering);
    if (params?.page) searchParams.set("page", String(params.page));
    const query = searchParams.toString();
    return apiService.get<VisitorListResponse>(
      `${VISITOR_CONSTANTS.API.LIST}${query ? `?${query}` : ""}`
    );
  },

  retrieve: async (id: number | string): Promise<VisitorDetailResponse> => {
    return apiService.get<VisitorDetailResponse>(VISITOR_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: VisitorCreatePayload): Promise<Visitor> => {
    return apiService.post<Visitor>(VISITOR_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: VisitorUpdatePayload): Promise<Visitor> => {
    return apiService.patch<Visitor>(VISITOR_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(VISITOR_CONSTANTS.API.DELETE(id));
  },

  approve: async (id: number | string, payload: { notes?: string }): Promise<Visitor> => {
    return apiService.post<Visitor>(VISITOR_CONSTANTS.API.APPROVE(id), {
      action: "approve",
      ...payload,
    });
  },

  reject: async (id: number | string, payload: { reason?: string }): Promise<Visitor> => {
    return apiService.post<Visitor>(VISITOR_CONSTANTS.API.REJECT(id), {
      action: "reject",
      ...payload,
    });
  },

  cancel: async (id: number | string): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(VISITOR_CONSTANTS.API.CANCEL(id), {});
  },

  block: async (id: number | string): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(VISITOR_CONSTANTS.API.BLOCK(id), {});
  },

  checkIn: async (
    id: number | string,
    payload?: VisitorCheckInPayload
  ): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(
      VISITOR_CONSTANTS.API.CHECK_IN(id),
      payload || {}
    );
  },

  checkOut: async (id: number | string): Promise<{ message: string; visit_duration_minutes?: number }> => {
    return apiService.post<{ message: string; visit_duration_minutes?: number }>(
      VISITOR_CONSTANTS.API.CHECK_OUT(id),
      {}
    );
  },

  generateQR: async (id: number | string): Promise<VisitorQRGenerateResponse> => {
    return apiService.post<VisitorQRGenerateResponse>(
      VISITOR_CONSTANTS.API.GENERATE_QR(id),
      {}
    );
  },

  verifyQR: async (id: number | string, qrToken: string): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(VISITOR_CONSTANTS.API.VERIFY_QR(id), {
      qr_token: qrToken,
    });
  },

  generateOTP: async (id: number | string): Promise<{ message: string; otp_expires_at: string | null; otp_attempts_remaining: number }> => {
    return apiService.post(VISITOR_CONSTANTS.API.GENERATE_OTP(id), {});
  },

  verifyOTP: async (
    id: number | string,
    otpCode: string
  ): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(VISITOR_CONSTANTS.API.VERIFY_OTP(id), {
      otp_code: otpCode,
    });
  },

  getHistory: async (id: number | string): Promise<VisitorHistoryEntry[]> => {
    return apiService.get<VisitorHistoryEntry[]>(VISITOR_CONSTANTS.API.HISTORY(id));
  },

  getStats: async (): Promise<VisitorStatsResponse> => {
    return apiService.get<VisitorStatsResponse>(VISITOR_CONSTANTS.API.STATS);
  },

  getBuildings: async (): Promise<any[]> => {
    return apiService.get<any[]>(VISITOR_CONSTANTS.API.BUILDINGS);
  },

  getUnits: async (buildingId?: number): Promise<any[]> => {
    const url = buildingId
      ? `${VISITOR_CONSTANTS.API.UNITS}?building=${buildingId}`
      : VISITOR_CONSTANTS.API.UNITS;
    return apiService.get<any[]>(url);
  },

  getRenters: async (unitId?: number): Promise<any[]> => {
    const url = unitId
      ? `${VISITOR_CONSTANTS.API.RENTERS}?unit=${unitId}`
      : VISITOR_CONSTANTS.API.RENTERS;
    return apiService.get<any[]>(url);
  },

  getNotifications: async (): Promise<any[]> => {
    return apiService.get<any[]>(VISITOR_CONSTANTS.API.NOTIFICATIONS);
  },

  verifyQRPublic: async (qrToken: string): Promise<any> => {
    return apiService.post(VISITOR_CONSTANTS.API.PUBLIC_VERIFY_QR, { qr_token: qrToken });
  },

  markExpired: async (): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(VISITOR_CONSTANTS.API.MARK_EXPIRED, {});
  },
};
