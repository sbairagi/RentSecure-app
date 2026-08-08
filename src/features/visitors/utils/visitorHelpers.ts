import { VISITOR_CONSTANTS } from "../constants/visitorConstants";
import type { Visitor, VisitorStatus } from "../types/visitors";

export const getStatusConfig = (status: VisitorStatus) => {
  return (
    VISITOR_CONSTANTS.STATUS_CONFIG[status] || {
      label: status,
      color: "#6b7280",
      backgroundColor: "#f3f4f6",
      icon: "📋",
    }
  );
};

export const getStatusLabel = (status: VisitorStatus) => {
  return VISITOR_CONSTANTS.STATUS_LABELS[status] || status;
};

export const getPurposeLabel = (purpose: string) => {
  return (
    VISITOR_CONSTANTS.PURPOSE_LABELS[purpose as keyof typeof VISITOR_CONSTANTS.PURPOSE_LABELS] ||
    purpose
  );
};

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
};

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const formatDuration = (minutes: number | null | undefined): string => {
  if (minutes == null || minutes === 0) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};

export const isVisitorActive = (visitor: Visitor): boolean => {
  return [
    VISITOR_CONSTANTS.STATUS.PENDING_APPROVAL,
    VISITOR_CONSTANTS.STATUS.APPROVED,
    VISITOR_CONSTANTS.STATUS.CHECKED_IN,
  ].includes(visitor.status);
};

export const canPerformAction = (
  visitor: Visitor,
  action: string
): boolean => {
  switch (action) {
    case "approve":
      return visitor.status === VISITOR_CONSTANTS.STATUS.PENDING_APPROVAL;
    case "reject":
      return visitor.status === VISITOR_CONSTANTS.STATUS.PENDING_APPROVAL;
    case "cancel":
      return [
        VISITOR_CONSTANTS.STATUS.REQUESTED,
        VISITOR_CONSTANTS.STATUS.PENDING_APPROVAL,
        VISITOR_CONSTANTS.STATUS.APPROVED,
      ].includes(visitor.status);
    case "check_in":
      return visitor.can_check_in;
    case "check_out":
      return visitor.can_check_out;
    case "generate_qr":
      return visitor.status === VISITOR_CONSTANTS.STATUS.APPROVED;
    case "generate_otp":
      return visitor.status === VISITOR_CONSTANTS.STATUS.APPROVED;
    default:
      return false;
  }
};

export const getHistoryIcon = (action: string): string => {
  const icons: Record<string, string> = {
    created: "📝",
    approved: "✅",
    rejected: "❌",
    checked_in: "🚪",
    checked_out: "🚶",
    cancelled: "🚫",
    blocked: "⛔",
    expired: "⏰",
    qr_generated: "📱",
    qr_verified: "🔍",
    otp_generated: "🔢",
    otp_verified: "✔️",
  };
  return icons[action] || "📌";
};

export const buildVisitorSearchQuery = (search: string) => ({
  search: search.trim(),
});

export const getVisitorCacheKey = (filters?: Record<string, unknown>) => {
  return `visitors_cache_${JSON.stringify(filters || {})}`;
};

export const isStaleCache = (timestamp: number, staleMs = 2 * 60 * 1000): boolean => {
  return Date.now() - timestamp > staleMs;
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, "").slice(0, 15);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+?1?\d{9,15}$/.test(phone);
};

export const maskPhone = (phone: string): string => {
  if (phone.length <= 4) return phone;
  return phone.slice(0, 3) + "****" + phone.slice(-2);
};

export const getOTPExpiryTime = (expiresAt: string | null | undefined): string => {
  if (!expiresAt) return "";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const getQRExpiryTime = (expiresAt: string | null | undefined): string => {
  if (!expiresAt) return "";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const buildHistoryMetadata = (
  vehicleDetails?: string,
  approverNotes?: string
): Record<string, unknown> => {
  const meta: Record<string, unknown> = {};
  if (vehicleDetails) meta.vehicle_details = vehicleDetails;
  if (approverNotes) meta.approver_notes = approverNotes;
  return meta;
};
