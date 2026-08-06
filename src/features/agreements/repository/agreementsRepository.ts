import { agreementsApi } from '../services/agreementsApi';
import type {
  Agreement,
  AgreementCreatePayload,
  AgreementDocument,
  AgreementFilters,
  AgreementListResponse,
  AgreementStatusSummary,
  AgreementTimelineEntry,
  AgreementUpdatePayload,
  AgreementWithRelations,
  AgreementWitness,
  BootstrapData,
  FeatureAccess,
  SubscriptionLimits,
} from '../types/agreements';

export const agreementsRepository = {
  fetchAgreements: async (params?: AgreementFilters): Promise<AgreementListResponse> => {
    return agreementsApi.list(params);
  },

  fetchAgreement: async (id: number | string): Promise<Agreement> => {
    return agreementsApi.retrieve(id);
  },

  createAgreement: async (data: AgreementCreatePayload): Promise<Agreement> => {
    return agreementsApi.create(data);
  },

  updateAgreement: async (
    id: number | string,
    data: AgreementUpdatePayload
  ): Promise<Agreement> => {
    return agreementsApi.update(id, data);
  },

  deleteAgreement: async (id: number | string): Promise<void> => {
    return agreementsApi.remove(id);
  },

  sendForSignature: async (id: number | string): Promise<Agreement> => {
    return agreementsApi.sendForSignature(id);
  },

  generatePDF: async (id: number | string): Promise<Blob> => {
    return agreementsApi.generatePDF(id);
  },

  fetchDocuments: async (agreementId: number | string): Promise<AgreementDocument[]> => {
    return agreementsApi.getDocuments(agreementId);
  },

  uploadDocument: async (
    agreementId: number | string,
    data: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AgreementDocument> => {
    return agreementsApi.uploadDocument(agreementId, data, onProgress);
  },

  fetchTimeline: async (agreementId: number | string): Promise<AgreementTimelineEntry[]> => {
    return agreementsApi.getTimeline(agreementId);
  },

  fetchWitnesses: async (agreementId: number | string): Promise<AgreementWitness[]> => {
    return agreementsApi.getWitnesses(agreementId);
  },

  addWitness: async (
    agreementId: number | string,
    witness: Partial<AgreementWitness>
  ): Promise<AgreementWitness> => {
    return agreementsApi.addWitness(agreementId, witness);
  },

  fetchTemplates: async (): Promise<Agreement[]> => {
    return agreementsApi.getTemplates();
  },

  fetchStatusSummary: async (): Promise<AgreementStatusSummary> => {
    return agreementsApi.getStatusSummary();
  },

  fetchRecentActivity: async (): Promise<AgreementTimelineEntry[]> => {
    return agreementsApi.getRecentActivity();
  },

  fetchBootstrapData: async (): Promise<BootstrapData> => {
    return agreementsApi.getBootstrapData();
  },

  fetchSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    return agreementsApi.getSubscriptionLimits();
  },

  fetchFeatureAccess: async (): Promise<FeatureAccess> => {
    return agreementsApi.getBootstrapData().then((data) => data.feature_access);
  },

  fetchRenters: async (): Promise<{ id: number; name: string }[]> => {
    return agreementsApi.getRenters();
  },

  fetchBuildings: async (): Promise<{ id: number; name: string }[]> => {
    return agreementsApi.getBuildings();
  },

  fetchUnits: async (): Promise<{ id: number; unit: string; building_name: string }[]> => {
    return agreementsApi.getUnits();
  },

  fetchNotifications: async (): Promise<any[]> => {
    return agreementsApi.getNotifications();
  },

  markNotificationRead: async (id: number | string): Promise<void> => {
    return agreementsApi.markNotificationRead(id);
  },
};
