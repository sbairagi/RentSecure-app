import { caretakersApi } from '../services/caretakersApi';
import type {
  Caretaker,
  CaretakerCreatePayload,
  CaretakerDetailResponse,
  CaretakerFilters,
  CaretakerListResponse,
  CaretakerUpdatePayload,
} from '../types/caretakers';

export const caretakersRepository = {
  fetchCaretakers: async (params?: CaretakerFilters): Promise<CaretakerListResponse> => {
    return caretakersApi.list(params);
  },

  fetchCaretaker: async (id: number | string): Promise<CaretakerDetailResponse> => {
    return caretakersApi.retrieve(id);
  },

  createCaretaker: async (data: CaretakerCreatePayload): Promise<Caretaker> => {
    return caretakersApi.create(data);
  },

  updateCaretaker: async (
    id: number | string,
    data: CaretakerUpdatePayload
  ): Promise<Caretaker> => {
    return caretakersApi.update(id, data);
  },

  deleteCaretaker: async (id: number | string): Promise<void> => {
    return caretakersApi.remove(id);
  },

  deactivateCaretaker: async (id: number | string): Promise<Caretaker> => {
    return caretakersApi.deactivate(id);
  },

  fetchLimits: async (): Promise<any> => {
    return caretakersApi.getLimits();
  },

  fetchSubscription: async (): Promise<any> => {
    return caretakersApi.getSubscription();
  },

  fetchNotifications: async (): Promise<any> => {
    return caretakersApi.getNotifications();
  },

  fetchUnitDocuments: async (unitId: number): Promise<any> => {
    return caretakersApi.getUnitDocuments(unitId);
  },
};
