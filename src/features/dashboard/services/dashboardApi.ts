import { apiService } from '@/services/api/apiClient';
import type { DashboardResponse, DashboardSummary } from '../types/dashboard';

export const dashboardApi = {
  getOwnerDashboard: async (): Promise<DashboardResponse> => {
    return apiService.get<DashboardResponse>('/properties/owner/dashboard/');
  },

  getOwnerDashboardSummary: async (): Promise<DashboardSummary> => {
    return apiService.get<DashboardSummary>('/properties/owner/dashboard-summary/');
  },

  getUnitAnalytics: async (): Promise<{
    total: number;
    occupied: number;
    vacant: number;
  }> => {
    return apiService.get('/properties/unit_analytics');
  },

  getPoliceVerificationStats: async (): Promise<{
    verified: number;
    submitted: number;
    not_started: number;
  }> => {
    return apiService.get('/police-verifications/dashboard_stats/');
  },

  getNotifications: async (): Promise<
    {
      id: number;
      title: string;
      message: string;
      is_read: boolean;
      created_at: string;
    }[]
  > => {
    return apiService.get('/notifications/get/');
  },

  markNotificationRead: async (notificationId: number): Promise<{ status: string }> => {
    return apiService.post(`/notifications/mark/${notificationId}/`, {});
  },
};
