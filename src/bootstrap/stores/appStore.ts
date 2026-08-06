import { create } from 'zustand';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { BootstrapErrorType, BootstrapPhase } from '../types/bootstrap';

interface AppBootstrapState {
  isInitialized: boolean;
  isOnline: boolean;
  isMaintenance: boolean;
  isForceUpdate: boolean;
  appVersion: string;
  backendVersion: string;
  maintenanceMessage: string;
  maintenanceScheduledAt: string | undefined;
  permissions: string[];
  subscription: any;
  featureLimits: any[];
  addons: any[];
  dashboardSummary: any;
  currentPhase: BootstrapPhase;
  error: BootstrapErrorType | null;
  errorMessage: string;
  retryCount: number;
}

interface AppBootstrapActions {
  setInitialized: (isInitialized: boolean) => void;
  setOnline: (isOnline: boolean) => void;
  setMaintenance: (isMaintenance: boolean, message?: string, scheduledAt?: string) => void;
  setForceUpdate: (isForceUpdate: boolean) => void;
  setAppVersion: (appVersion: string) => void;
  setBackendVersion: (backendVersion: string) => void;
  setPhase: (currentPhase: BootstrapPhase) => void;
  setError: (error: BootstrapErrorType | null, errorMessage?: string) => void;
  incrementRetry: () => void;
  initialize: () => Promise<{
    success: boolean;
    errorType?: BootstrapErrorType;
    errorMessage?: string;
  }>;
  reload: () => Promise<{
    success: boolean;
    errorType?: BootstrapErrorType;
    errorMessage?: string;
  }>;
  reset: () => void;
}

type AppStore = AppBootstrapState & AppBootstrapActions;

const initialState: AppBootstrapState = {
  isInitialized: false,
  isOnline: false,
  isMaintenance: false,
  isForceUpdate: false,
  appVersion: '',
  backendVersion: '',
  maintenanceMessage: '',
  maintenanceScheduledAt: undefined,
  permissions: [],
  subscription: null,
  featureLimits: [],
  addons: [],
  dashboardSummary: null,
  currentPhase: 'idle',
  error: null,
  errorMessage: '',
  retryCount: 0,
};

export const useAppStore = create<AppStore>((set, _get) => ({
  ...initialState,

  setInitialized: (isInitialized) => set({ isInitialized }),

  setOnline: (isOnline) => set({ isOnline }),

  setMaintenance: (isMaintenance, maintenanceMessage = '', maintenanceScheduledAt) =>
    set({
      isMaintenance,
      maintenanceMessage,
      maintenanceScheduledAt,
    }),

  setForceUpdate: (isForceUpdate) => set({ isForceUpdate }),

  setAppVersion: (appVersion) => set({ appVersion }),

  setBackendVersion: (backendVersion) => set({ backendVersion }),

  setPhase: (currentPhase) => set({ currentPhase }),

  setError: (error, errorMessage = '') => set({ error, errorMessage }),

  incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),

  initialize: async () => {
    const { bootstrapService } = await import('../services/bootstrapService');
    const result = await bootstrapService.initialize();
    if (!result.success && result.errorType) {
      set({
        error: result.errorType,
        errorMessage: result.errorMessage || BOOTSTRAP_CONSTANTS.ERROR_MESSAGES[result.errorType],
      });
    }
    return result;
  },

  reload: async () => {
    set({ retryCount: 0, error: null, errorMessage: '', isInitialized: false });
    const { bootstrapService } = await import('../services/bootstrapService');
    const result = await bootstrapService.initialize();
    return result;
  },

  reset: () =>
    set({
      ...initialState,
      isOnline: false,
    }),
}));
