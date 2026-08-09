import { DEEP_LINK_SCHEME, DEEP_LINK_HOST, DEEP_LINK_PREFIXES } from '@/navigation/constants';
import { ROUTE_REGISTRY } from '@/navigation/routes';

export interface ExpoLinkingConfig {
  prefixes: string[];
  config: {
    screens: Record<string, string>;
  };
}

export function createExpoLinkingConfig(): ExpoLinkingConfig {
  const screens: Record<string, string> = {};

  for (const route of ROUTE_REGISTRY) {
    if (route.isPublic || route.group === 'auth') {
      screens[route.name] = route.path;
    }
  }

  return {
    prefixes: [...DEEP_LINK_PREFIXES] as string[],
    config: {
      screens,
    },
  };
}

export function getDeepLinkPrefixes(): string[] {
  return [...DEEP_LINK_PREFIXES] as string[];
}

export function getDeepLinkScheme(): string {
  return DEEP_LINK_SCHEME;
}

export function getDeepLinkHost(): string {
  return DEEP_LINK_HOST;
}
