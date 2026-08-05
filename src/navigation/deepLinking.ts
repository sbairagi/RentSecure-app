import type { DeepLinkPayload, DeepLinkType } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

const DEEP_LINK_SCHEME = 'rentsecureapp';
const DEEP_LINK_HOST = 'app.rentsecureapp.com';

export const DeepLinkingConfig = {
  scheme: DEEP_LINK_SCHEME,
  prefixes: [`${DEEP_LINK_SCHEME}://`, `https://${DEEP_LINK_HOST}`],
  config: {
    screens: {
      splash: 'splash',
      welcome: '(auth)/welcome',
      login: '(auth)/login',
      register: '(auth)/register',
      forgotPassword: '(auth)/forgot-password',
      otp: '(auth)/otp',
      resetPassword: '(auth)/reset-password',
      createPassword: '(auth)/create-password',
      dashboard: '(drawer)/(tabs)/dashboard',
      properties: '(drawer)/(tabs)/properties',
      buildings: '(drawer)/(tabs)/buildings',
      units: '(drawer)/(tabs)/units',
      renters: '(drawer)/(tabs)/renters',
      caretakers: '(drawer)/(tabs)/caretakers',
      payments: '(drawer)/(tabs)/payments',
      agreements: '(drawer)/(tabs)/agreements',
      notifications: '(drawer)/(tabs)/notifications',
      subscription: '(drawer)/(tabs)/subscription',
      reports: '(drawer)/(tabs)/reports',
      settings: '(drawer)/(tabs)/settings',
      support: '(drawer)/(tabs)/support',
      profile: '(drawer)/(tabs)/profile',
      'rent-record-detail': '(drawer)/(tabs)/payments/rent-record/[id]',
      'agreement-detail': '(drawer)/(tabs)/agreements/[id]',
      'unit-detail': '(drawer)/(tabs)/units/[id]',
      'building-detail': '(drawer)/(tabs)/buildings/[id]',
      'renter-detail': '(drawer)/(tabs)/renters/[id]',
      'payment-link': 'payment/[token]',
      invitation: 'invitation/[token]',
      'agreement-sign': 'agreement/[id]/sign',
    },
  },
};

export function parseDeepLink(url: string): DeepLinkPayload | null {
  try {
    const parsed = new URL(url);

    if (parsed.protocol === `${DEEP_LINK_SCHEME}:`) {
      const path = parsed.pathname.replace(/^\//, '');
      const segments = path.split('/').filter(Boolean);

      if (segments.length === 0) {
        return { type: 'general', action: 'open' };
      }

      const type = segments[0];
      const id = segments[1];
      const action = segments[2];

      switch (type) {
        case 'payment':
          return {
            type: 'payment' as DeepLinkType,
            id: id ?? undefined,
            token: parsed.searchParams.get('token') ?? undefined,
          };
        case 'invitation':
          return { type: 'invitation' as DeepLinkType, token: id ?? undefined };
        case 'agreement':
          return { type: 'agreement' as DeepLinkType, id: id ?? undefined, action };
        case 'rent-record':
          return { type: 'rent_record' as DeepLinkType, id: id ?? undefined };
        case 'notification':
          return { type: 'notification' as DeepLinkType, id: id ?? undefined };
        default:
          return { type: 'general' as DeepLinkType, action: type };
      }
    }

    if (parsed.hostname === DEEP_LINK_HOST) {
      const path = parsed.pathname.replace(/^\//, '');
      const segments = path.split('/').filter(Boolean);

      if (segments[0] === 'payment') {
        return {
          type: 'payment',
          id: segments[1] ?? undefined,
          token: parsed.searchParams.get('token') ?? undefined,
        };
      }
      if (segments[0] === 'invitation') {
        return { type: 'invitation', token: segments[1] ?? undefined };
      }
      if (segments[0] === 'agreement') {
        return { type: 'agreement', id: segments[1] ?? undefined, action: segments[2] };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function getDeepLinkRoute(payload: DeepLinkPayload): string {
  const isAuth = useAuthStore.getState().isAuthenticated;

  if (!isAuth) {
    return '/(auth)/welcome';
  }

  switch (payload.type) {
    case 'payment':
      return `/(drawer)/(tabs)/payments/rent-record/${payload.id || 'pending'}`;
    case 'invitation':
      return '/(auth)/register';
    case 'agreement':
      return `/(drawer)/(tabs)/agreements/${payload.id || 'list'}`;
    case 'rent_record':
      return `/(drawer)/(tabs)/payments/rent-record/${payload.id || 'list'}`;
    case 'notification':
      return '/(drawer)/(tabs)/notifications/list';
    default:
      return '/(drawer)/(tabs)/dashboard';
  }
}

export function useDeepLinking() {
  const router = useRouter();

  const handleDeepLink = useCallback(
    (url: string | null | undefined) => {
      if (!url) return;

      const payload = parseDeepLink(url);
      if (!payload) return;

      const route = getDeepLinkRoute(payload);
      router.replace(route as any);
    },
    [router]
  );

  return { handleDeepLink, parseDeepLink, getDeepLinkRoute };
}
