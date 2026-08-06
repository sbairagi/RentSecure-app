import { rentersApi } from '../services/rentersApi';
import type {
  Building,
  ExtraCharge,
  FeatureAccess,
  KycDocument,
  Notification,
  PoliceVerification,
  Renter,
  RenterActivity,
  RenterAgreement,
  RenterAssignUnitPayload,
  RenterBulkNotifyPayload,
  RenterCreatePayload,
  RenterDocument,
  RenterFilters,
  RenterListResponse,
  RenterNote,
  RenterStatusSummary,
  RenterTimelineEntry,
  RenterTransferUnitPayload,
  RenterUpdatePayload,
  RentRecord,
  SubscriptionLimits,
  Unit,
} from '../types/renters';

export const rentersRepository = {
  fetchRenters: async (params?: RenterFilters): Promise<RenterListResponse> => {
    return rentersApi.list(params);
  },

  fetchRenter: async (id: number | string): Promise<Renter> => {
    return rentersApi.retrieve(id);
  },

  createRenter: async (data: RenterCreatePayload): Promise<Renter> => {
    return rentersApi.create(data);
  },

  updateRenter: async (id: number | string, data: RenterUpdatePayload): Promise<Renter> => {
    return rentersApi.update(id, data);
  },

  deleteRenter: async (id: number | string): Promise<void> => {
    return rentersApi.remove(id);
  },

  rateRenter: async (id: number | string, rating: number, review?: string): Promise<Renter> => {
    return rentersApi.rate(id, rating, review);
  },

  updateRenterStatus: async (id: number | string, status: string): Promise<Renter> => {
    return rentersApi.updateStatus(id, status);
  },

  vacateRenter: async (id: number | string, end_date?: string): Promise<Renter> => {
    return rentersApi.vacate(id, end_date);
  },

  fetchStatusSummary: async (): Promise<RenterStatusSummary> => {
    return rentersApi.getStatusSummary();
  },

  fetchRecentActivity: async (): Promise<RenterActivity[]> => {
    return rentersApi.getRecentActivity();
  },

  fetchTimeline: async (id: number | string): Promise<RenterTimelineEntry[]> => {
    return rentersApi.getTimeline(id);
  },

  assignUnit: async (id: number | string, payload: RenterAssignUnitPayload): Promise<Renter> => {
    return rentersApi.assignUnit(id, payload);
  },

  transferUnit: async (
    id: number | string,
    payload: RenterTransferUnitPayload
  ): Promise<Renter> => {
    return rentersApi.transferUnit(id, payload);
  },

  fetchKycDocuments: async (renterId: number | string): Promise<KycDocument[]> => {
    return rentersApi.getKycDocuments(renterId);
  },

  createKycDocument: async (
    renterId: number | string,
    data: FormData,
    onProgress?: (progress: number) => void
  ): Promise<KycDocument> => {
    return rentersApi.createKycDocument(renterId, data, onProgress);
  },

  fetchKycDocument: async (id: number | string): Promise<KycDocument> => {
    return rentersApi.getKycDocument(id);
  },

  updateKycDocument: async (
    id: number | string,
    data: Partial<KycDocument>
  ): Promise<KycDocument> => {
    return rentersApi.updateKycDocument(id, data);
  },

  deleteKycDocument: async (id: number | string): Promise<void> => {
    return rentersApi.deleteKycDocument(id);
  },

  processKycOcr: async (id: number | string): Promise<{ extracted_text: string }> => {
    return rentersApi.processKycOcr(id);
  },

  fetchDocuments: async (renterId: number | string): Promise<RenterDocument[]> => {
    return rentersApi.getDocuments(renterId);
  },

  fetchNotes: async (renterId: number | string): Promise<RenterNote[]> => {
    return rentersApi.getNotes(renterId);
  },

  createNote: async (renterId: number | string, note: string): Promise<RenterNote> => {
    return rentersApi.createNote(renterId, note);
  },

  updateNote: async (id: number | string, note: string): Promise<RenterNote> => {
    return rentersApi.updateNote(id, note);
  },

  deleteNote: async (id: number | string): Promise<void> => {
    return rentersApi.deleteNote(id);
  },

  bulkNotify: async (
    renterId: number | string,
    payload: RenterBulkNotifyPayload
  ): Promise<{ sent: number }> => {
    return rentersApi.bulkNotify(renterId, payload);
  },

  exportRenters: async (format: 'csv' | 'xlsx', renterIds?: number[]): Promise<Blob> => {
    return rentersApi.exportRenters(format, renterIds);
  },

  importRenters: async (
    file: File
  ): Promise<{ imported: number; failed: number; errors: string[] }> => {
    return rentersApi.importRenters(file);
  },

  fetchRentRecords: async (renterId?: number | string): Promise<RentRecord[]> => {
    return rentersApi.getRentRecords(renterId);
  },

  fetchExtraCharges: async (renterId?: number | string): Promise<ExtraCharge[]> => {
    return rentersApi.getExtraCharges(renterId);
  },

  fetchPoliceVerifications: async (renterId?: number | string): Promise<PoliceVerification[]> => {
    return rentersApi.getPoliceVerifications(renterId);
  },

  fetchAgreements: async (renterId?: number | string): Promise<RenterAgreement[]> => {
    return rentersApi.getAgreements(renterId);
  },

  fetchNotifications: async (): Promise<Notification[]> => {
    return rentersApi.getNotifications();
  },

  markNotificationRead: async (id: number | string): Promise<void> => {
    return rentersApi.markNotificationRead(id);
  },

  fetchBootstrapData: async (): Promise<any> => {
    return rentersApi.getBootstrapData();
  },

  fetchSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    return rentersApi.getSubscriptionLimits();
  },

  fetchFeatureAccess: async (): Promise<FeatureAccess> => {
    return rentersApi.getBootstrapData().then((data) => data.feature_access);
  },

  fetchUnits: async (): Promise<Unit[]> => {
    return rentersApi.getUnits();
  },

  fetchBuildings: async (): Promise<Building[]> => {
    return rentersApi.getBuildings();
  },

  generateRentAgreementPdf: async (id: number | string): Promise<Blob> => {
    return rentersApi.generateRentAgreementPdf(id);
  },

  generatePropertyDossierPdf: async (id: number | string): Promise<Blob> => {
    return rentersApi.generatePropertyDossierPdf(id);
  },
};
