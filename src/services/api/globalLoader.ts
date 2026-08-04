import { create } from 'zustand';

export type LoadingScope = 'global' | 'page' | 'button' | 'upload' | 'download';

interface LoadingState {
  activeRequests: number;
  scope: LoadingScope | null;
  scopeMessage?: string;
  increment: () => void;
  decrement: () => void;
  setScope: (scope: LoadingScope | null, message?: string) => void;
  clearScope: () => void;
}

export const useGlobalLoaderStore = create<LoadingState>((set, get) => ({
  activeRequests: 0,
  scope: null,
  scopeMessage: undefined,

  increment: () => {
    const { activeRequests } = get();
    set({ activeRequests: activeRequests + 1 });
  },

  decrement: () => {
    const { activeRequests } = get();
    const newCount = Math.max(0, activeRequests - 1);
    set({ activeRequests: newCount });
  },

  setScope: (scope, message) => {
    set({ scope, scopeMessage: message });
  },

  clearScope: () => {
    set({ scope: null, scopeMessage: undefined });
  },
}));

export function useGlobalLoader() {
  const activeRequests = useGlobalLoaderStore((state) => state.activeRequests);
  const scope = useGlobalLoaderStore((state) => state.scope);
  const scopeMessage = useGlobalLoaderStore((state) => state.scopeMessage);

  const isLoading = activeRequests > 0 || scope !== null;
  const isGlobalLoading = activeRequests > 0;

  return {
    isLoading,
    isGlobalLoading,
    activeRequests,
    scope,
    scopeMessage,
  };
}
