import { tokenManager } from './tokenManager';
import { SECURITY_CONSTANTS } from '../constants';
import type { SessionState } from '../types';

export class SessionManager {
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private sessionTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<(state: SessionState) => void> = new Set();

  start(): void {
    this.scheduleSessionExpiry();
    this.scheduleInactivityCheck();
  }

  stop(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  async onUserActivity(): Promise<void> {
    await tokenManager.updateLastActivity();
    this.scheduleInactivityCheck();
    this.notifyListeners();
  }

  async forceLogout(): Promise<void> {
    this.stop();
    await tokenManager.clearSession();
    this.notifyListeners();
  }

  getSessionState(): SessionState {
    return tokenManager.getSessionState();
  }

  isAuthenticated(): boolean {
    return tokenManager.getSessionState().isAuthenticated;
  }

  subscribe(listener: (state: SessionState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private scheduleSessionExpiry(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    const remaining = tokenManager.getSessionRemainingMs();
    if (remaining === null || remaining <= 0) {
      return;
    }

    this.sessionTimer = setTimeout(() => {
      this.forceLogout();
    }, remaining);
  }

  private scheduleInactivityCheck(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    const state = tokenManager.getSessionState();
    if (!state.isAuthenticated) {
      return;
    }

    const lastActivity = state.lastActivityAt || Date.now();
    const inactivityDelay =
      SECURITY_CONSTANTS.INACTIVITY_TIMEOUT_MS -
      (Date.now() - lastActivity);

    if (inactivityDelay <= 0) {
      this.forceLogout();
      return;
    }

    this.inactivityTimer = setTimeout(() => {
      this.forceLogout();
    }, inactivityDelay);
  }

  private notifyListeners(): void {
    const state = this.getSessionState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error('Session listener error', error);
      }
    });
  }
}

export const sessionManager = new SessionManager();
